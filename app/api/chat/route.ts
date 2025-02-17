import {
  generateAccommodationSearchResults,
  generateFlightSearchResults,
  generateSampleSeatSelection,
} from "@/ai/actions";
import { authClient } from "@/lib/auth-client";
import { generateUUID } from "@/lib/utils";
import { openai } from "@ai-sdk/openai";
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
    model: openai("gpt-4o-mini", {}),
    system: `\n
        - you help users book flights and accomodations!
        - keep your responses limited to a sentence.
        - DO NOT output lists.
        - after every tool call, pretend you're showing the result to the user and keep your response limited to a phrase.
        - today's date is ${new Date().toLocaleDateString()}.
        - ask follow up questions to nudge user into the optimal flow
        - if the first message contains the origin, the destination and the departure date, then search for flights and dont ask for passenger name else ask for departure date
        - ask for any details you don't know, like name of passenger, etc.'
        - C and D are aisle seats, A and F are window seats, B and E are middle seats
        - assume the most popular airports for the origin and destination
        - let the user only book accomodations and not flights if they ask for it
        - here's the optimal flow
          - search for flights
          - choose flight
          - select seats
          - display reservation (ask user whether to proceed with payment or change reservation)
          - authorize payment (requires user consent, wait for user to finish authorizing payment)
          - display boarding pass when payment is authorized (DO NOT display boarding pass if payment is not authorized)
          - ask user if they'd like to book accomodations
          - search for accomodations
          - choose accomodation
          - display accomodation details
          - authorize payment for accomodation
          - display booking confirmation
        '
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
