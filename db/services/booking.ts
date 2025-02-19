"use server";

import { db } from "@/db";
import { eq, inArray, sql } from "drizzle-orm";
import {
  booking,
  bookingPassenger,
  bookingFlight,
  bookingAccommodation,
  passenger,
} from "@/db/schema";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";

type bookingInsert = typeof booking.$inferInsert;
type bookingSelect = typeof booking.$inferSelect;
type bookingPassengerInsert = typeof bookingPassenger.$inferInsert;
type bookingFlightInsert = typeof bookingFlight.$inferInsert;
type bookingAccommodationInsert = typeof bookingAccommodation.$inferInsert;
type bookingFlightSelect = typeof bookingFlight.$inferSelect;
type bookingAccommodationSelect = typeof bookingAccommodation.$inferSelect;

export type bookingSelectWithFlightAndAccommodation = bookingSelect & {
  booking_flights: bookingFlightSelect[];
  booking_accommodations: bookingAccommodationSelect[];
};

export async function createInitialBooking({
  passengers,
  bookingType,
  destinationCity,
  destinationCountry,
  originCity,
  originCountry,
}: {
  passengers: string[];
  bookingType: string;
  destinationCity: string;
  destinationCountry: string;
  originCity: string;
  originCountry: string;
}) {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  let bookingId: string;

  const bookingData: bookingInsert = {
    userId: session.user.id,
    bookingType,
    status: "pending",
    totalAmount: "0",
    currency: "EUR",
    paymentStatus: "pending",
    startingDate: new Date(8640000000000000).toISOString(),
    endingDate: new Date(-8640000000000000).toISOString(),
    originCity,
    originCountry,
    destinationCity,
    destinationCountry,
  };

  try {
    const result = await db.insert(booking).values(bookingData).returning();
    bookingId = result[0].id;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create booking");
  }

  const bookingPassengerData: bookingPassengerInsert[] = passengers.map(
    (passengerId) => ({
      bookingId,
      passengerId,
      isPrimary: false,
    })
  );

  await db.insert(bookingPassenger).values(bookingPassengerData);

  return bookingId;
}

export async function createFlightBooking({
  bookingId,
  cabinClass,
  priceAmount,
  priceCurrency,
  airline,
  flightNumber,
  departureAirport,
  arrivalAirport,
  departureDateTime,
  arrivalDateTime,
}: {
  bookingId: string;
  cabinClass: string;
  priceAmount: string;
  priceCurrency: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDateTime: string;
  arrivalDateTime: string;
}) {
  let initialBooking: bookingSelect[];
  try {
    initialBooking = await db
      .select()
      .from(booking)
      .where(eq(booking.id, bookingId));
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get initial booking");
  }

  if (!initialBooking) {
    throw new Error("Booking not found");
  }

  const bookingFlightData: bookingFlightInsert = {
    bookingId,
    cabinClass,
    priceAmount,
    priceCurrency,
    flightNumber,
    airline,
    departureAirport,
    arrivalAirport,
    departureDateTime,
    arrivalDateTime,
  };

  //Update the booking type and starting date
  const earliestDate = Math.min(
    new Date(departureDateTime).getTime(),
    new Date(initialBooking[0].startingDate).getTime()
  );

  const latestDate = Math.max(
    new Date(arrivalDateTime).getTime(),
    new Date(initialBooking[0].endingDate).getTime()
  );

  try {
    await db
      .update(booking)
      .set({
        bookingType:
          initialBooking[0].bookingType === "flight" ? "flight" : "both",
        startingDate: new Date(earliestDate).toISOString(),
        endingDate: new Date(latestDate).toISOString(),
      })
      .where(eq(booking.id, bookingId));
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update booking type");
  }

  try {
    await db.insert(bookingFlight).values(bookingFlightData);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create booking flight");
  }

  return bookingId;
}

export async function createAccommodationBooking({
  bookingId,
  pricePerNight,
  checkInDate,
  checkOutDate,
  accommodationNameAddressCityCountry,
  accommodationStarRating,
  numberOfRooms,
}: {
  bookingId: string;
  pricePerNight: string;
  checkInDate: string;
  checkOutDate: string;
  accommodationNameAddressCityCountry: string;
  accommodationStarRating: number;
  numberOfRooms: number;
}) {
  let initialBooking: bookingSelect[];
  try {
    initialBooking = await db
      .select()
      .from(booking)
      .where(eq(booking.id, bookingId));
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get initial booking");
  }

  if (!initialBooking) {
    throw new Error("Booking not found");
  }

  const earliestDate = Math.min(
    new Date(checkInDate).getTime(),
    new Date(initialBooking[0].startingDate).getTime()
  );

  const latestDate = Math.max(
    new Date(checkOutDate).getTime(),
    new Date(initialBooking[0].endingDate).getTime()
  );

  try {
    await db
      .update(booking)
      .set({
        bookingType:
          initialBooking[0].bookingType === "accommodation"
            ? "accommodation"
            : "both",
        startingDate: new Date(earliestDate).toISOString(),
        endingDate: new Date(latestDate).toISOString(),
      })
      .where(eq(booking.id, bookingId));
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update booking type");
  }

  const [
    accommodationName,
    accommodationAddress,
    accommodationCity,
    accommodationCountry,
  ] = accommodationNameAddressCityCountry.split(",");
  const bookingAccommodationData: bookingAccommodationInsert = {
    bookingId,
    pricePerNight,
    priceCurrency: "EUR",
    numberOfRooms,
    checkInDate,
    checkOutDate,
    name: accommodationName,
    address: accommodationAddress,
    city: accommodationCity,
    country: accommodationCountry,
    starRating: Math.round(accommodationStarRating),
  };

  try {
    await db.insert(bookingAccommodation).values(bookingAccommodationData);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create booking accommodation");
  }

  return bookingId;
}

export type TripInfo = {
  bookingInfo: bookingSelect;
  bookingFlights: bookingFlightSelect[];
  bookingAccommodations: bookingAccommodationSelect[];
  passengerInfo: (typeof passenger.$inferSelect)[];
};

export async function getTripsInfo(userId: string): Promise<TripInfo[]> {
  try {
    const bookingInfo = await db
      .select()
      .from(booking)
      .where(eq(booking.userId, userId));

    const bookingFlights = await db
      .select()
      .from(bookingFlight)
      .where(
        inArray(
          bookingFlight.bookingId,
          bookingInfo.map((b) => b.id)
        )
      );

    const bookingAccommodations = await db
      .select()
      .from(bookingAccommodation)
      .where(
        inArray(
          bookingAccommodation.bookingId,
          bookingInfo.map((b) => b.id)
        )
      );

    const bookingPassengers = await db
      .select()
      .from(bookingPassenger)
      .where(
        inArray(
          bookingPassenger.bookingId,
          bookingInfo.map((b) => b.id)
        )
      );

    const passengerInfo = await db
      .select()
      .from(passenger)
      .where(
        inArray(
          passenger.id,
          bookingPassengers.map((p) => p.passengerId)
        )
      );

    const groupedBookings = bookingInfo.map((booking) => {
      return {
        bookingInfo: booking,
        bookingFlights: bookingFlights.filter(
          (f) => f.bookingId === booking.id
        ),
        bookingAccommodations: bookingAccommodations.filter(
          (a) => a.bookingId === booking.id
        ),
        passengerInfo: passengerInfo.filter((p) =>
          bookingPassengers.some((bp) => bp.passengerId === p.id)
        ),
      };
    });

    return groupedBookings;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get trip info");
  }
}

export async function getPastTripsInfo(userId: string): Promise<TripInfo[]> {
  const tripsInfo = await getTripsInfo(userId);
  return tripsInfo.filter(
    (t) => new Date(t.bookingInfo.endingDate) < new Date()
  );
}

export async function getUpcomingAndCurrentTripsInfo(
  userId: string
): Promise<TripInfo[]> {
  const tripsInfo = await getTripsInfo(userId);
  return tripsInfo.filter(
    (t) => new Date(t.bookingInfo.endingDate) >= new Date()
  );
}

export async function deleteBookingInfo(bookingId: string): Promise<void> {
  try {
    await db.delete(booking).where(eq(booking.id, bookingId));
    console.log("Successfully deleted passenger info: ", bookingId);
  } catch (error) {
    console.error("Error deleting passenger info:", error);
    throw error;
  }
}
