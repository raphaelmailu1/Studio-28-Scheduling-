from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from firebase_admin import auth
from config.firebase import db

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


class StylistCreate(BaseModel):
    name: str
    email: str
    password: str


@router.post("/create-stylist")
def create_stylist(data: StylistCreate):

    try:

        # Firebase Auth account
        user = auth.create_user(
            email=data.email,
            password=data.password
        )

        # Firestore user profile
        db.collection("users").document(
            user.uid
        ).set({
            "name": data.name,
            "email": data.email,
            "role": "stylist",
            "active": True,
            "phone": ""
        })

        # Firestore stylist record
        db.collection("stylists").add({
            "name": data.name,
            "email": data.email,
            "active": True,
            "uid": user.uid
        })

        return {
            "message": "Stylist created successfully"
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )