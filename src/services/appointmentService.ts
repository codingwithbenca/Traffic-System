
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  doc,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

import type {
  AppointmentBookingData,
} from "../types/appointment";

/* =========================================================
   TYPES
========================================================= */

export type CreateAppointmentInput = {
  userId: string;
  booking: AppointmentBookingData;
};

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface FirestoreAppointment {
  id: string;
  userId: string;

  appointmentNumber: string;

  service: {
    id: string;
    name: string;
    description?: string | null;
    duration?: string | null;
  };

  branch: {
    id: string;
    name: string;
    address?: string | null;
    city?: string | null;
    province?: string | null;
    phone?: string | null;
    hours?: string | null;
  };

  date: string;
  time: string;

  status: AppointmentStatus;

  createdAt?: any;
  updatedAt?: any;
}

/* =========================================================
   CREATE APPOINTMENT
========================================================= */

export const createAppointment = async ({
  userId,
  booking,
}: CreateAppointmentInput): Promise<{
  appointmentId: string;
  appointmentNumber: string;
}> => {
  console.log("========================================");
  console.log(
    "🔥 CREATE APPOINTMENT SERVICE STARTED"
  );
  console.log("========================================");

  console.log(
    "[appointmentService] userId:",
    userId
  );

  console.log(
    "[appointmentService] booking:",
    booking
  );

  if (!userId) {
    console.error(
      "[appointmentService] ❌ Missing userId"
    );

    throw new Error(
      "User ID is required."
    );
  }

  if (
    !booking.service ||
    !booking.branch ||
    !booking.date ||
    !booking.time
  ) {
    console.error(
      "[appointmentService] ❌ Incomplete booking"
    );

    throw new Error(
      "Incomplete appointment information."
    );
  }

  const appointmentsRef = collection(
    db,
    "appointments"
  );

  const appointmentNumber =
    `APT-${Date.now()}`;

  const appointmentData = {
    userId,

    appointmentNumber,

    service: {
      id: booking.service.id,
      name: booking.service.name,
      description:
        booking.service.description,
      duration:
        booking.service.duration ?? null,
    },

    branch: {
      id: booking.branch.id,
      name: booking.branch.name,
      address:
        booking.branch.address ?? null,
      city:
        booking.branch.city ?? null,
      province:
        booking.branch.province ?? null,
      phone:
        booking.branch.phone ?? null,
      hours:
        booking.branch.hours ?? null,
    },

    date: booking.date,
    time: booking.time,

    status: "confirmed",

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  console.log(
    "[appointmentService] Writing appointment:",
    appointmentData
  );

  try {
    const appointmentRef =
      await addDoc(
        appointmentsRef,
        appointmentData
      );

    console.log(
      "[appointmentService] ✅ Appointment created:",
      appointmentRef.id
    );

    console.log(
      "[appointmentService] Reference:",
      appointmentNumber
    );

    return {
      appointmentId:
        appointmentRef.id,
      appointmentNumber,
    };
  } catch (error) {
    console.error(
      "[appointmentService] ❌ Create failed:",
      error
    );

    throw error;
  }
};

/* =========================================================
   GET MY APPOINTMENTS
========================================================= */

export const getMyAppointments = async (
  userId: string
): Promise<FirestoreAppointment[]> => {
  console.log("========================================");
  console.log(
    "📅 GET MY APPOINTMENTS STARTED"
  );
  console.log("========================================");

  console.log(
    "[appointmentService] userId:",
    userId
  );

  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  try {
    const appointmentsRef =
      collection(db, "appointments");

    const q = query(
      appointmentsRef,
      where("userId", "==", userId)
    );

    console.log(
      "[appointmentService] Querying Firestore..."
    );

    const snapshot =
      await getDocs(q);

    console.log(
      "[appointmentService] Documents found:",
      snapshot.size
    );

    const appointments =
      snapshot.docs.map((appointmentDoc) => {
        const data =
          appointmentDoc.data();

        return {
          id: appointmentDoc.id,
          ...data,
        } as FirestoreAppointment;
      });

    /*
     * Sort newest/relevant appointments first.
     *
     * We intentionally sort in JavaScript so we
     * don't need a composite Firestore index.
     */
    appointments.sort((a, b) => {
      const dateA =
        `${a.date} ${a.time}`;

      const dateB =
        `${b.date} ${b.time}`;

      return dateA.localeCompare(
        dateB
      );
    });

    console.log(
      "[appointmentService] ✅ Appointments loaded:",
      appointments.length
    );

    return appointments;
  } catch (error) {
    console.error(
      "[appointmentService] ❌ Failed to load appointments:",
      error
    );

    throw error;
  }
};

/* =========================================================
   CANCEL APPOINTMENT
========================================================= */

export const cancelAppointment = async (
  appointmentId: string
): Promise<void> => {
  console.log("========================================");
  console.log(
    "❌ CANCEL APPOINTMENT STARTED"
  );
  console.log("========================================");

  console.log(
    "[appointmentService] appointmentId:",
    appointmentId
  );

  if (!appointmentId) {
    throw new Error(
      "Appointment ID is required."
    );
  }

  try {
    const appointmentRef = doc(
      db,
      "appointments",
      appointmentId
    );

    await updateDoc(
      appointmentRef,
      {
        status: "cancelled",
        updatedAt: serverTimestamp(),
      }
    );

    console.log(
      "[appointmentService] ✅ Appointment cancelled"
    );
  } catch (error) {
    console.error(
      "[appointmentService] ❌ Cancellation failed:",
      error
    );

    throw error;
  }
};

