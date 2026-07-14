import os
import json
import firebase_admin

from firebase_admin import credentials, firestore, auth

if not firebase_admin._apps:

    if "FIREBASE_CREDENTIALS" in os.environ:
        # Render
        cred = credentials.Certificate(
            json.loads(os.environ["FIREBASE_CREDENTIALS"])
        )
    else:
        # Local development
        cred = credentials.Certificate(
            "studio-28-scheduling-firebase-adminsdk-fbsvc-a73a7a21e4.json"
        )

    firebase_admin.initialize_app(cred)

db = firestore.client()