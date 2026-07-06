from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

conf = ConnectionConfig(
    MAIL_USERNAME="raphaelmailu1@gmail.com",
    MAIL_PASSWORD="pxnv gzde qswc vrbq",   # Gmail App Password
    MAIL_FROM="raphaelmailu1@gmail.com",
    MAIL_FROM_NAME="Studio 28",

    MAIL_SERVER="smtp.gmail.com",
    MAIL_PORT=587,

    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,

    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)


async def send_booking_email(
    email: str,
    name: str,
    service: str,
    stylist: str,
    appointment_time: str,
):
    message = MessageSchema(
        subject="Studio 28 Booking Confirmation",
        recipients=[email],
        body=f"""
Hello {name},

Your Studio 28 appointment has been confirmed.

-------------------------------------
Service: {service}
Stylist: {stylist}
Appointment: {appointment_time}
-------------------------------------

We look forward to seeing you.

Thank you for choosing Studio 28.

Kind Regards,

Studio 28 Team
""",
        subtype="plain",
    )

    fm = FastMail(conf)
    await fm.send_message(message)