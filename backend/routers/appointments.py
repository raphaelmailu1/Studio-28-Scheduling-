from fastapi import APIRouter, HTTPException, Query
from models.appointment import AppointmentCreate
from config.firebase import db
from datetime import datetime, timedelta
from datetime import datetime, timedelta, timezone, time
from zoneinfo import ZoneInfo
from utils.email import send_booking_email

def parse_firestore_datetime(value):
    if not value:
        return None

    # Convert string → datetime
    if isinstance(value, str):
        value = datetime.fromisoformat(value)

    # Ensure UTC timezone
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)

    return value

router = APIRouter()
appointments_ref = db.collection("appointments")

# SERVICES WITH DURATIONS
SERVICES = {
    "Retight 2hr - 3hrs duo": timedelta(hours=3),
    "Retight 3hrs - 4hrs solo": timedelta(hours=4),
    "Braiding": timedelta(hours=6),
    "Color": timedelta(hours=2, minutes=30),
    "Two strand": timedelta(hours=4),
    "Installation": timedelta(hours=16),
    "Undo": timedelta(hours=18),
    "Beauty ManiPedi": timedelta(hours=2, minutes=30)
}


# =========================
# CREATE APPOINTMENT
# =========================
@router.post("/")
async def create_appointment(appointment: AppointmentCreate):

    duration = SERVICES.get(appointment.service)
    if not duration:
        raise HTTPException(status_code=400, detail="Invalid service")

    buffer = timedelta(minutes=30)
    kenya = ZoneInfo("Africa/Nairobi")

    # Ensure UTC
    if appointment.start_time.tzinfo is None:
        appointment.start_time = appointment.start_time.replace(
            tzinfo=timezone.utc
        )
    else:
        appointment.start_time = appointment.start_time.astimezone(
            timezone.utc
        )

    # Calculate end time
    end_time = appointment.start_time + duration + buffer

    # Prevent past bookings
    now = datetime.now(timezone.utc)

    if appointment.start_time < now:
        raise HTTPException(
            status_code=400,
            detail="Cannot book in the past"
        )

    # Booking window
    max_booking_date = now + timedelta(days=30)

    if appointment.start_time > max_booking_date:
        raise HTTPException(
            status_code=400,
            detail="Bookings can only be made 30 days in advance"
        )

    # Business hours
    local_time = appointment.start_time.astimezone(kenya)

    opening_time = time(6, 30)
    latest_booking = time(14, 30)
    closing_time = time(19, 30)

    # Earliest booking
    if local_time.time() < opening_time:
        raise HTTPException(
            status_code=400,
            detail="Bookings start at 6:30 AM"
        )

    # Latest starting time
    if local_time.time() > latest_booking:
        raise HTTPException(
            status_code=400,
            detail="The latest booking time is 2:30 PM"
        )

    # Service must finish before closing
    end_local = end_time.astimezone(kenya)

    if end_local.time() > closing_time:
        raise HTTPException(
            status_code=400,
            detail="Service finishes after the salon closes at 7:30 PM"
        )
    # Conflict checking
    existing_appointments = appointments_ref.stream()

    for doc in existing_appointments:

        existing = doc.to_dict()

        existing_start = parse_firestore_datetime(
            existing.get("start_time")
        )

        existing_end = parse_firestore_datetime(
            existing.get("end_time")
        )

        if not existing_start or not existing_end:
            continue

        # Primary stylist conflict
        if existing.get("stylist") == appointment.stylist:

            if (
                appointment.start_time < existing_end
                and end_time > existing_start
            ):
                raise HTTPException(
                    status_code=400,
                    detail="Time slot already booked"
                )

        # Second stylist conflict
        if (
            appointment.second_stylist
            and existing.get("stylist") == appointment.second_stylist
        ):

            if (
                appointment.start_time < existing_end
                and end_time > existing_start
            ):
                raise HTTPException(
                    status_code=400,
                    detail=f"{appointment.second_stylist} is already booked."
                )

        # Client double booking
        if existing.get("client_phone") == appointment.client_phone:

            if (
                appointment.start_time < existing_end
                and end_time > existing_start
            ):
                raise HTTPException(
                    status_code=400,
                    detail="Client already has a booking during this time"
                )

    # Save appointment
    appointment_data = appointment.dict()

    appointment_data["start_time"] = appointment.start_time.isoformat()
    appointment_data["end_time"] = end_time.isoformat()
    appointment_data["status"] = "booked"

    appointments_ref.add(appointment_data)

    # Send confirmation email
    await send_booking_email(
        email=appointment.client_email,
        name=appointment.client_name,
        service=appointment.service,
        stylist=(
            f"{appointment.stylist}"
            + (
                f" & {appointment.second_stylist}"
                if appointment.second_stylist
                else ""
            )
        ),
        appointment_time=appointment.start_time.strftime(
            "%A %d %B %Y at %I:%M %p"
        )
    )

    return {
        "message": "Appointment created successfully"
    }

# =========================
# GET APPOINTMENTS
# =========================
@router.get("/")
def get_appointments():
    docs = appointments_ref.stream()

    return [
        {**doc.to_dict(), "id": doc.id}
        for doc in docs
    ]


# =========================
# AVAILABLE SLOTS
# =========================
@router.get("/available-slots")
def get_available_slots(
    date: str = Query(...),
    service: str = Query(...),
    stylist: str = Query(...)
):
    duration = SERVICES.get(service)
    if not duration:
        raise HTTPException(status_code=400, detail="Invalid service")

    kenya = ZoneInfo("Africa/Nairobi")

    # Parse date
    selected_date = datetime.strptime(date, "%Y-%m-%d")

    # Kenya business hours
    opening_local = datetime.combine(
        selected_date,
        time(6, 30)
    ).replace(tzinfo=kenya)

    closing_local = datetime.combine(
        selected_date,
        time(19, 30)
    ).replace(tzinfo=kenya)

    latest_booking_local = datetime.combine(
        selected_date,
        time(14, 30)
    ).replace(tzinfo=kenya)

    latest_booking = latest_booking_local.astimezone(
        timezone.utc
    )

    # Convert to UTC
    opening = opening_local.astimezone(timezone.utc)
    closing = closing_local.astimezone(timezone.utc)
    
    

    # Get existing bookings
    existing_docs = list(appointments_ref.stream())


    available_slots = []
    current = opening

    buffer = timedelta(minutes=30)

    while current <= latest_booking:
        slot_end = current + duration + buffer
        conflict = False

        # Handle long services (multi-day)
        if duration > (closing - opening):
            return {
                "multi_day": True,
                "message": "This service requires multiple days. Please choose a start date.",
                "available_slots": []
            }

        # If service doesn't fit in working hours → mark unavailable
        if slot_end > closing:
            available_slots.append({
                "time": current.isoformat(),
                "available": False,
                "invalid": True
            })

            current += timedelta(minutes=30)
            continue

        for doc in existing_docs:
            existing = doc.to_dict()

            if existing.get("stylist") != stylist:
                continue

            existing_start = parse_firestore_datetime(existing.get("start_time"))
            existing_end = parse_firestore_datetime(existing.get("end_time"))

            if not existing_start or not existing_end:
                continue

            if current < existing_end and slot_end > existing_start:
                conflict = True
                break

        available_slots.append({
            "time": current.isoformat(),
            "available": not conflict,
            "invalid": False
        })

        current += timedelta(minutes=30)

    return available_slots

# =========================
# CANCEL APPOINTMENT
# =========================
@router.patch("/cancel/{appointment_id}")
def cancel_appointment(appointment_id: str):

    doc_ref = appointments_ref.document(appointment_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appointment = doc.to_dict()

    if appointment["status"] in ["cancelled", "completed"]:
        raise HTTPException(
            status_code=400,
            detail="Cannot cancel this appointment"
        )

    doc_ref.update({"status": "cancelled"})

    return {"message": "Appointment cancelled"}


# =========================
# COMPLETE APPOINTMENT
# =========================
@router.patch("/complete/{appointment_id}")
def complete_appointment(appointment_id: str):

    doc_ref = appointments_ref.document(appointment_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appointment = doc.to_dict()

    if appointment["status"] == "completed":
        raise HTTPException(
            status_code=400,
            detail="Appointment already completed"
        )

    doc_ref.update({"status": "completed"})

    return {"message": "Appointment marked as completed"}