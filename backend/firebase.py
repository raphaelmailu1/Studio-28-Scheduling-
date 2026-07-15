import os
import json
import base64
import firebase_admin
from firebase_admin import credentials, firestore

if not firebase_admin._apps:

    if os.getenv("FIREBASE_CREDENTIALS_B64"):
        decoded = base64.b64decode(
            os.getenv("FIREBASE_CREDENTIALS_B64")
        ).decode("utf-8")

        cred = credentials.Certificate(
            json.loads(decoded)
        )

    else:
        cred = credentials.Certificate(
            "studio-28-scheduling-firebase-adminsdk-fbsvc-a73a7a21e4.json"
        )

    firebase_admin.initialize_app(cred)

db = firestore.client()