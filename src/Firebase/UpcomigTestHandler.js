import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./config";

export async function GetUpcomingTestHandler() {
  try {
    const TestColectionRef = collection(db, "Tests");
    const TestCollectionSnapShot = await getDocs(TestColectionRef);
    const UpcomingTestsHolder = [];

    TestCollectionSnapShot.forEach((doc) => {
      const data = doc.data();
      UpcomingTestsHolder.push({
        tests: doc.id,
        TestDetails: data.TestDetails,
      });
    });

    return UpcomingTestsHolder;
  } catch (error) {
    alert("Pleae retry again")
    console.log("These are the error - ", error);
  }
}

