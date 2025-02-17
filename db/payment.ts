"use server";

import { db } from ".";
import { paymentInfo } from "./schema";

type paymentInfoInsertType = typeof paymentInfo.$inferInsert;

//saves payment data for current user to the database when called
//is called at the corresponding payment info page
export async function savePaymentInfo(
  data: paymentInfoInsertType
): Promise<void> {
  try {
    const newPaymentInfo: paymentInfoInsertType = {
      userId: data.userId,
      token: data.token,
      encryptedCardNumber: data.encryptedCardNumber,
      iv: data.iv,
      cardType: data.cardType,
      last4: data.last4,
      magicWord: data.magicWord,
    };
    await db.insert(paymentInfo).values(newPaymentInfo);
    console.log("Successfully saved payment info: ", newPaymentInfo);
  } catch (error) {
    console.error("Error saving payment info:", error);
    throw error;
  }
}
