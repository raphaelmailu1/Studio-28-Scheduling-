from fastapi import APIRouter, HTTPException
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter()

SECRET_KEY = "supersecret"
ALGORITHM = "HS256"

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"


@router.post("/login")
def login(username: str, password: str):

    if username != ADMIN_USERNAME or password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    payload = {
        "sub": username,
        "exp": datetime.utcnow() + timedelta(hours=2)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": token}