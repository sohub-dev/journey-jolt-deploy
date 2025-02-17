import {
  generateAccommodationSearchResults,
  generateFlightSearchResults,
  generateSampleSeatSelection,
  getOfferById,
} from "@/ai/actions";
import { authClient } from "@/lib/auth-client";
import { generateUUID } from "@/lib/utils";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { headers } from "next/headers";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages, id } = await req.json();

  console.log("chat id", id); // can be used for persisting the chat

  // Call the language model
  const result = streamText({
    model: google("gemini-2.0-flash-001"),
    maxSteps: 5,
    maxRetries: 3,
    // system: `\n
    //     You are a precise Travel Agent that helps users book trips (flights and accommodations). You must use tools whenever possible. Your responses must be very concise and use short sentences.

    //     Today's date is ${new Date().toLocaleDateString()}

    //     Available Tools:
    //       - searchFlights
    //       - selectSeats
    //       - displayReservation
    //       - authorizePayment
    //       - verifyPayment
    //       - displayBoardingPass
    //       - searchAccommodations

    //     Instructions:
    //       - After any tool call, do not output/display lists of flights, seats, accommodations, etc.
    //       - Do not output/display lists of flights, seats, accommodations, etc.
    //       - Ask questions to nudge the user to follow the optimal flow.

    //     Optimal Flow:
    //       - Ask the user if they want to book a one-way or round trip.
    //       - If one-way, ask for departure date.
    //       - If round trip, ask for both departure and return dates.
    //       - If round trip, first complete outbound flight booking and then return flight booking.
    //       - Search for flights separately for each flight leg.
    //       - For each flight leg:
    //         - Use 'searchFlights' tool to find flights.
    //         - Ask the user to choose a flight, without outputting a list of flights.
    //         - Use 'selectSeats' tool to prompt the user for seat selection.
    //         - Use 'displayReservation' tool without outputting a list of details.
    //           - Ask if he wants to continue to payment or change something.
    //         - Use 'authorizePayment' tool if the user wants to continue to payment.
    //           - Wait for payment authorization.
    //         - Use 'verifyPayment' tool to verify payment status.
    //         - Only after payment authorization is complete and you have verified the payment, use 'displayBoardingPass'.
    //       - After the user has completed booking the flight or flights if it is a round trip, ask if they want to book accommodations at their destination.
    //       - For accommodation booking:
    //         - Use 'searchAccommodations' tool to find accommodations.
    //         - Ask the user to choose an accommodation, without outputting a list of accommodations.
    //         - Use 'authorizePayment' tool
    //           - Wait for payment authorization.
    //         - Use 'verifyPayment' tool to verify payment status.
    //         - Only after payment authorization is complete and you have verified the payment, confirm the booking details.
    //   `,
    // system: `\n
    //   - you help user book flights and accommodations.
    //   - today's date is ${new Date().toLocaleDateString()}
    //   - your answers and questions must be concise and to the point.
    //   - DO NOT output lists.
    //   - you must use tools whenever possible.
    //   - you must not output/display lists of flights, seats, accommodations, etc.
    //   - after tool calls, pretend you're showing the result to the user because it is handled by the ui, keep your response limited to a phrase.
    //   - ask follow up questions to nudge user into the optimal flow
    //   - assume the most popular airports for the origin and destination
    //   - here is the optimal flow:
    //     - ask the user if they want to book a one-way or round trip.
    //     - if one-way, ask for departure date.
    //     - if round trip, ask for both departure and return dates.
    //     - if round trip, first complete outbound flight search and booking and then return flight search and booking.
    //     - search for flights separately for each flight leg.
    //     - for each flight leg:
    //       - use 'searchFlights' tool to find flights.
    //       - ask the user to choose a flight, without outputting a list of flights.
    //       - use 'selectSeats' tool to prompt the user for seat selection.
    //       - use 'displayReservation' tool without outputting a list of details.
    //       - ask if he wants to continue to payment or change something.
    //       - use 'authorizePayment' tool if the user wants to continue to payment.
    //       - wait for payment authorization.
    //       - only after the user has authorized payment, use 'verifyPayment' tool to verify payment status.
    //       - use 'displayBoardingPass' tool to display the boarding pass after the payment is verified.
    //     - after the user has completed booking the flight or flights if it is a round trip, ask if they want to book accommodations at their destination.
    //     - for accommodation booking:
    //       - use 'searchAccommodations' tool to find accommodations.
    //       - ask the user to choose an accommodation, without outputting a list of accommodations.
    //       - use 'authorizePayment' tool
    //       - wait for payment authorization.
    //       - use 'verifyPayment' tool to verify payment status.
    //       - only after payment authorization is complete and you have verified the payment, confirm the booking details.
    // `,
    system: `\n
      - you help users book flights and accommodations.
      - today's date is ${new Date().toLocaleDateString()}
      - your answers and questions must be concise and to the point.
      - DO NOT output lists.
      - you must use tools whenever possible.
      - you must not output/display lists of flights, seats, accommodations, etc.
      - ask follow up questions to nudge user into the optimal flow
      - ask questions to get the information you need to book the flights or accommodations
      - assume the most popular airports for the origin and destination
      - to search for flights you need:
        - origin
        - destination
        - departure date
        - number of passengers
        - cabin class
      - to search for accommodations you need:
        - destination
        - check in date
        - check out date
        - number of guests
        - number of rooms
      - here is the optimal flow:
        - ask the user if they want to book a one-way or round trip.
        - search for flights separately for each desired flight leg.
        - for each flight leg:
          - use 'searchFlights' tool to find flights.
          - ask the user to choose a flight, without outputting a list of flights.
          - use 'selectSeats' tool to prompt the user for seat selection.
          - use 'displayReservation' tool without outputting a list of details.
          - ask if he wants to continue to payment or change something.
          - use 'authorizePayment' tool if the user wants to continue to payment.
          - wait for payment authorization.
          - only after the user has authorized payment, use 'verifyPayment' tool to verify payment status.
          - use 'displayBoardingPass' tool to display the boarding pass after the payment is verified.
        - after the user has completed booking the flight or flights, you must ask if they want to book accommodations at their destination.
        - for accommodation booking:
          - ask if check in and check out dates are the same as the flight dates or not.
          - if they are not, ask for the check in and check out dates.
          - use 'searchAccommodations' tool to find accommodations.
          - ask the user to choose an accommodation, without outputting a list of accommodations.
          - use 'authorizePayment' tool
          - wait for payment authorization.
          - use 'verifyPayment' tool to verify payment status.
          - only after payment authorization is complete and you have verified the payment, confirm the booking details.
    `,
    messages,
    tools: {
      searchFlights: {
        description: "Search for flights based on the given parameters",
        parameters: z.object({
          origin: z.string().describe("Origin airport iata code"),
          destination: z.string().describe("Destination airport iata code"),
          departureDate: z
            .string()
            .describe("Departure date in ISO 8601 format"),
        }),
        execute: async ({ origin, destination, departureDate }) => {
          const results = await generateFlightSearchResults({
            origin,
            destination,
            departureDate,
          });

          return results;
        },
      },
      selectSeats: {
        description: "Select seats for a flight",
        parameters: z.object({
          flightNumber: z.string().describe("Flight number"),
        }),
        execute: async ({ flightNumber }) => {
          const seats = await generateSampleSeatSelection({ flightNumber });
          return seats;
        },
      },
      displayReservation: {
        description: "Display pending reservation details",
        parameters: z.object({
          offerId: z.string().describe("Offer ID"),
          seats: z.string().array().describe("Array of selected seat numbers"),
          flightNumber: z.string().describe("Flight number"),
          departure: z.object({
            cityName: z.string().describe("Name of the departure city"),
            airportCode: z.string().describe("Code of the departure airport"),
            timestamp: z.string().describe("ISO 8601 date of departure"),
            gate: z.string().describe("Departure gate"),
            terminal: z.string().describe("Departure terminal"),
          }),
          arrival: z.object({
            cityName: z.string().describe("Name of the arrival city"),
            airportCode: z.string().describe("Code of the arrival airport"),
            timestamp: z.string().describe("ISO 8601 date of arrival"),
            gate: z.string().describe("Arrival gate"),
            terminal: z.string().describe("Arrival terminal"),
          }),
          passengerName: z.string().describe("Name of the passenger"),
          totalPriceInEuros: z
            .number()
            .describe("Total price in Euros including flight and seat"),
        }),
        execute: async (props) => {
          const { data: session } = await authClient.getSession({
            fetchOptions: {
              headers: await headers(),
            },
          });

          const id = generateUUID();

          if (session && session.user && session.user.id) {
            return { ...props };
          } else {
            return {
              error: "User is not signed in to perform this action!",
            };
          }
        },
      },
      authorizePayment: {
        description:
          "User will enter credentials to authorize payment, wait for user to repond when they are done",
        parameters: z.object({
          offerId: z.string().describe("Unique identifier for the offer"),
        }),
        execute: async ({ offerId }) => {
          return { offerId };
        },
      },
      verifyPayment: {
        description: "Verify payment status",
        parameters: z.object({
          offerId: z.string().describe("Unique identifier for the offer"),
        }),
        execute: async ({ offerId }) => {
          return { hasCompletedPayment: true };
        },
      },
      // createBooking: {
      //   description: "Create a booking",
      //   parameters: z.object({
      //     offerId: z.string().describe("Offer ID"),
      //     seats: z.string().array().describe("Array of selected seat numbers"),
      //     flightNumber: z.string().describe("Flight number"),
      //     departure: z.object({
      //       cityName: z.string().describe("Name of the departure city"),
      //       airportCode: z.string().describe("Code of the departure airport"),
      //       timestamp: z.string().describe("ISO 8601 date of departure"),
      //       gate: z.string().describe("Departure gate"),
      //       terminal: z.string().describe("Departure terminal"),
      //     }),
      //     arrival: z.object({
      //       cityName: z.string().describe("Name of the arrival city"),
      //       airportCode: z.string().describe("Code of the arrival airport"),
      //       timestamp: z.string().describe("ISO 8601 date of arrival"),
      //       gate: z.string().describe("Arrival gate"),
      //       terminal: z.string().describe("Arrival terminal"),
      //     }),
      //     passengerName: z.string().describe("Name of the passenger"),
      //     totalPriceInEuros: z
      //       .number()
      //       .describe("Total price in Euros including flight and seat"),
      //   }),
      //   execute: async (props) => {
      //     const { data: session } = await authClient.getSession({
      //       fetchOptions: {
      //         headers: await headers(),
      //       },
      //     });

      //     const id = generateUUID();

      //     if (session && session.user && session.user.id) {
      //       return { ...props };
      //     } else {
      //       return {
      //         error: "User is not signed in to perform this action!",
      //       };
      //     }
      //   },
      // },
      displayBoardingPass: {
        description: "Display a boarding pass",
        parameters: z.object({
          reservationId: z
            .string()
            .describe("Unique identifier for the reservation"),
          passengerName: z
            .string()
            .describe("Name of the passenger, in title case"),
          flightNumber: z.string().describe("Flight number"),
          seat: z.string().describe("Seat number"),
          departure: z.object({
            cityName: z.string().describe("Name of the departure city"),
            airportCode: z.string().describe("Code of the departure airport"),
            airportName: z.string().describe("Name of the departure airport"),
            timestamp: z.string().describe("ISO 8601 date of departure"),
            terminal: z.string().describe("Departure terminal"),
            gate: z.string().describe("Departure gate"),
          }),
          arrival: z.object({
            cityName: z.string().describe("Name of the arrival city"),
            airportCode: z.string().describe("Code of the arrival airport"),
            airportName: z.string().describe("Name of the arrival airport"),
            timestamp: z.string().describe("ISO 8601 date of arrival"),
            terminal: z.string().describe("Arrival terminal"),
            gate: z.string().describe("Arrival gate"),
          }),
        }),
        execute: async (boardingPass) => {
          return boardingPass;
        },
      },
      searchAccommodations: {
        description: "Search for accomodations based on the given parameters",
        parameters: z.object({
          destinationCountry: z.string().describe("Country of the destination"),
          destinationCity: z.string().describe("City of the destination"),
          checkInDate: z.string().describe("Check in date in ISO 8601 format"),
          checkOutDate: z
            .string()
            .describe("Check out date in ISO 8601 format"),
        }),
        execute: async ({
          destinationCountry,
          destinationCity,
          checkInDate,
          checkOutDate,
        }) => {
          const results = await generateAccommodationSearchResults({
            destinationCountry,
            destinationCity,
            checkInDate,
            checkOutDate,
          });

          return results;
        },
      },
    },

    async onError(error) {
      console.error("Error", error);
    },
    async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
      console.log("text", text);
      console.log("finishReason", finishReason);
      console.log("toolCalls", toolCalls);
      console.log("toolResults", toolResults);
      console.log("usage", usage);
    },
  });

  // Respond with the stream
  return result.toDataStreamResponse();
}
