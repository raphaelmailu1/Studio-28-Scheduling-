import firebase_admin

from firebase_admin import (
    credentials,
    firestore,
    auth
)

cred = credentials.Certificate(
    "studio-28-scheduling-firebase-adminsdk-fbsvc-a73a7a21e4.json"
)

firebase_admin.initialize_app(cred)

db = firestore.client()