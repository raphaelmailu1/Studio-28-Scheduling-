import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1F698S90hvbW0Xbd1FcSZvu4RgiWQ_GE",
  authDomain: "studio-28-scheduling.firebaseapp.com",
  projectId: "studio-28-scheduling",
  storageBucket: "studio-28-scheduling.firebasestorage.app",
  messagingSenderId:  "623336281915",
  appId: "1:623336281915:web:3fded0e99fe02d95a9891e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);


