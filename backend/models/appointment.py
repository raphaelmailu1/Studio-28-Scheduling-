from pydantic import BaseModel
from datetime import datetime

class AppointmentCreate(BaseModel):
    client_name: str
    client_phone: str
    client_email: str
    service: str
    stylist: str
    second_stylist: str | None = None
    start_time: datetime