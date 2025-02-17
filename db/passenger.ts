"use server";

import { db } from ".";
import { passenger } from "./schema";

type passengerInfoInsert = typeof passenger.$inferInsert;
//saves passenger data to the database when called
//is called at the passenger registration page
export async function savePassengerInfo(
  data: passengerInfoInsert
): Promise<void> {
  try {
    const newPassengerInfo: passengerInfoInsert = {
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      nationality: data.nationality,
      passportNumber: data.passportNumber,
      passportExpiry: data.passportExpiry,
      //alias: data.alias,
    };
    await db.insert(passenger).values(newPassengerInfo);
    console.log("Successfully saved passenger info: ", newPassengerInfo);
  } catch (error) {
    console.error("Error saving passenger info:", error);
    throw error;
  }
}
