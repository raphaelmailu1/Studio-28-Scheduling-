import { db } from "../config/firebase";

import {
  collection,
  getDocs,
} from "firebase/firestore";

export async function getStylists() {
  const snapshot = await getDocs(
    collection(db, "stylists")
  );

  return snapshot.docs
  .map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  .filter((s) => s.active);
}