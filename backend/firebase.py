import os
import json
import base64
import firebase_admin
from firebase_admin import credentials, firestore

print("FIREBASE_CREDENTIALS_B64 exists:",
      "FIREBASE_CREDENTIALS_B64" in os.environ)

if not firebase_admin._apps:

    if "FIREBASE_CREDENTIALS_B64" in os.environ:
        print("Using Render Environment Variable")

        decoded = base64.b64decode(
            os.environ["FIREBASE_CREDENTIALS_B64"]
        ).decode("utf-8")

        cred = credentials.Certificate(json.loads(decoded))

    else:
        print("Using Local JSON File")

        cred = credentials.Certificate(
            "studio-28-scheduling-firebase-adminsdk-fbsvc-a73a7a21e4.json"
        )

    firebase_admin.initialize_app(cred)

db = firestore.client()