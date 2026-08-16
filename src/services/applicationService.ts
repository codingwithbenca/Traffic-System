
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

/* =========================================================
   TYPES
========================================================= */

export type ApplicationStatus =
  | "Pending"
  | "Processing"
  | "Approved"
  | "Completed"
  | "Rejected";

export interface Application {
  id: string;
  citizenId: string;

  type: string;
  description: string;

  submittedDate: string;
  reference: string;

  status: ApplicationStatus;

  createdAt?: any;
  updatedAt?: any;
}

/* =========================================================
   GET CITIZEN APPLICATIONS
========================================================= */

export const getCitizenApplications = async (
  citizenId: string
): Promise<Application[]> => {
  console.log(
    "[ApplicationService] ================================="
  );

  console.log(
    "[ApplicationService] Loading applications..."
  );

  console.log(
    "[ApplicationService] Citizen ID:",
    citizenId
  );

  if (!citizenId) {
    console.log(
      "[ApplicationService] ERROR: No citizen ID provided"
    );

    return [];
  }

  try {
    const applicationsRef = collection(
      db,
      "applications"
    );

    console.log(
      "[ApplicationService] Collection: applications"
    );

    const q = query(
      applicationsRef,
      where("citizenId", "==", citizenId),
      orderBy("createdAt", "desc")
    );

    console.log(
      "[ApplicationService] Executing Firestore query..."
    );

    const snapshot = await getDocs(q);

    console.log(
      "[ApplicationService] Documents found:",
      snapshot.size
    );

    const applications: Application[] = snapshot.docs.map(
      (document) => {
        const data = document.data();

        console.log(
          "[ApplicationService] Application:",
          document.id,
          data
        );

        return {
          id: document.id,
          citizenId: data.citizenId,

          type: data.type ?? "Unknown Application",

          description:
            data.description ??
            "Application submitted through Moova.",

          submittedDate:
            data.submittedDate ??
            formatDate(data.createdAt),

          reference:
            data.reference ??
            `APP-${document.id}`,

          status:
            data.status ?? "Pending",

          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      }
    );

    console.log(
      "[ApplicationService] Applications loaded successfully:",
      applications.length
    );

    console.log(
      "[ApplicationService] ================================="
    );

    return applications;
  } catch (error) {
    console.error(
      "[ApplicationService] Failed to load applications:",
      error
    );

    throw error;
  }
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (timestamp: any): string => {
  if (!timestamp) {
    return "Unknown date";
  }

  try {
    const date =
      timestamp?.toDate
        ? timestamp.toDate()
        : new Date(timestamp);

    return date.toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Unknown date";
  }
};

