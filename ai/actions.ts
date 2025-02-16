import { z } from "zod";
import { Duffel } from "@duffel/api";
import { env } from "@/lib/env";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";

const duffel = new Duffel({
  token: env.DUFFEL_TOKEN,
});

const flightResultSchema = z.object({
  offerId: z.string().describe("Offer ID"),
  flightNumber: z.string().describe("Flight number, e.g., BA123, AA31"),
  departure: z.object({
    cityName: z.string().describe("Name of the departure city"),
    airportCode: z.string().describe("IATA code of the departure airport"),
    airportName: z.string().describe("Full name of the departure airport"),
    timestamp: z.string().describe("ISO 8601 departure date and time"),
    terminal: z.string().describe("Departure terminal"),
    gate: z.string().describe("Departure gate"),
  }),
  connection: z
    .object({
      airportCode: z.string().describe("IATA code of the connection airport"),
      airportName: z.string().describe("Full name of the connection airport"),
      arrivalTimestamp: z
        .string()
        .describe("ISO 8601 arrival time at connection"),
      departureTimestamp: z
        .string()
        .describe("ISO 8601 departure time from connection"),
    })
    .optional()
    .describe("Connection details if the flight is connecting"),
  arrival: z.object({
    cityName: z.string().describe("Name of the arrival city"),
    airportCode: z.string().describe("IATA code of the arrival airport"),
    airportName: z.string().describe("Full name of the arrival airport"),
    timestamp: z.string().describe("ISO 8601 arrival date and time"),
    terminal: z.string().describe("Arrival terminal"),
    gate: z.string().describe("Arrival gate"),
  }),
  airlines: z.array(z.string()).describe("List of airlines"),
  cabinClass: z.string().describe("Cabin class, e.g., economy, business"),
  totalDistanceInMiles: z.number().describe("Total flight distance in miles"),
  priceInEuros: z.number().describe("Price in euros"),
});

// const SAMPLE = {
//   flights: [
//     {
//       id: "result_1",
//       departure: {
//         cityName: "San Francisco",
//         airportCode: "SFO",
//         timestamp: "2024-05-19T18:00:00Z",
//       },
//       arrival: {
//         cityName: "Rome",
//         airportCode: "FCO",
//         timestamp: "2024-05-20T14:30:00Z",
//       },
//       airlines: ["United Airlines", "Lufthansa"],
//       priceInUSD: 1200.5,
//       numberOfStops: 1,
//     },
//     {
//       id: "result_2",
//       departure: {
//         cityName: "San Francisco",
//         airportCode: "SFO",
//         timestamp: "2024-05-19T17:30:00Z",
//       },
//       arrival: {
//         cityName: "Rome",
//         airportCode: "FCO",
//         timestamp: "2024-05-20T15:00:00Z",
//       },
//       airlines: ["British Airways"],
//       priceInUSD: 1350,
//       numberOfStops: 0,
//     },
//     {
//       id: "result_3",
//       departure: {
//         cityName: "San Francisco",
//         airportCode: "SFO",
//         timestamp: "2024-05-19T19:15:00Z",
//       },
//       arrival: {
//         cityName: "Rome",
//         airportCode: "FCO",
//         timestamp: "2024-05-20T16:45:00Z",
//       },
//       airlines: ["Delta Air Lines", "Air France"],
//       priceInUSD: 1150.75,
//       numberOfStops: 1,
//     },
//   ],
// };

export async function generateFlightSearchResults({
  origin,
  destination,
  departureDate,
}: {
  origin: string;
  destination: string;
  departureDate: string;
}) {
  const flights = await duffel.offerRequests.create({
    max_connections: 1,
    supplier_timeout: 5000,
    slices: [
      {
        origin: origin,
        destination: destination,
        departure_date: departureDate,
        arrival_time: null,
        departure_time: null,
      },
    ],
    passengers: [
      {
        type: "adult",
      },
    ],
  });

  const results = transformFlightData(flights);
  const resultsWithoutDuffelAirways = results.filter(
    (result: any) => !result.airlines.includes("Duffel Airways")
  );

  const firstSevenResults = resultsWithoutDuffelAirways.slice(0, 7);

  return { flights: firstSevenResults };
}

function transformFlightData(apiResponse: any) {
  const { offers } = apiResponse.data;

  return offers.map((offer: any) => {
    const slice = offer.slices[0];
    const segments = slice.segments;
    const offerId = offer.id;

    // Handling a direct flight (one segment)
    if (segments.length === 1) {
      const seg = segments[0];
      const flightNumber = `${seg.marketing_carrier.iata_code}${seg.marketing_carrier_flight_number}`;
      const airlines = Array.from(
        new Set([seg.marketing_carrier.name, seg.operating_carrier.name])
      );
      const cabinClass = seg.passengers[0].cabin_class;
      const totalDistanceInMiles = parseFloat(seg.distance) * 0.621371;

      return {
        offerId,
        flightNumber,
        departure: {
          cityName: seg.origin.city_name,
          airportCode: seg.origin.iata_code,
          airportName: seg.origin.name,
          timestamp: seg.departing_at,
          terminal: seg.origin_terminal || "",
          gate: "",
        },
        arrival: {
          cityName: seg.destination.city_name,
          airportCode: seg.destination.iata_code,
          airportName: seg.destination.name,
          timestamp: seg.arriving_at,
          terminal: seg.destination_terminal || "",
          gate: "",
        },
        airlines,
        cabinClass,
        totalDistanceInMiles,
        priceInEuros: offer.total_amount,
      };
    }
    // Handling a connecting flight (two segments)
    else if (segments.length === 2) {
      const firstSeg = segments[0];
      const secondSeg = segments[1];
      const flightNumber = `${firstSeg.marketing_carrier.iata_code}${firstSeg.marketing_carrier_flight_number} / ${secondSeg.marketing_carrier.iata_code}${secondSeg.marketing_carrier_flight_number}`;
      const airlines = Array.from(
        new Set([
          firstSeg.marketing_carrier.name,
          firstSeg.operating_carrier.name,
          secondSeg.marketing_carrier.name,
          secondSeg.operating_carrier.name,
        ])
      );
      const cabinClass = firstSeg.passengers[0].cabin_class; // assuming consistent cabin class
      const totalDistanceInMiles =
        (parseFloat(firstSeg.distance) + parseFloat(secondSeg.distance)) *
        0.621371;

      return {
        offerId,
        flightNumber,
        departure: {
          cityName: firstSeg.origin.city_name,
          airportCode: firstSeg.origin.iata_code,
          airportName: firstSeg.origin.name,
          timestamp: firstSeg.departing_at,
          terminal: firstSeg.origin_terminal || "",
          gate: "",
        },
        connection: {
          airportCode: firstSeg.destination.iata_code,
          airportName: firstSeg.destination.name,
          arrivalTimestamp: firstSeg.arriving_at,
          departureTimestamp: secondSeg.departing_at,
        },
        arrival: {
          cityName: secondSeg.destination.city_name,
          airportCode: secondSeg.destination.iata_code,
          airportName: secondSeg.destination.name,
          timestamp: secondSeg.arriving_at,
          terminal: secondSeg.destination_terminal || "",
          gate: "",
        },
        airlines,
        cabinClass,
        totalDistanceInMiles,
        priceInEuros: offer.total_amount,
      };
    }
    // Fallback: if segments count is unexpected, return data based on the first segment.
    else {
      const seg = segments[0];
      const flightNumber = `${seg.marketing_carrier.iata_code}${seg.marketing_carrier_flight_number}`;
      const airlines = Array.from(
        new Set([seg.marketing_carrier.name, seg.operating_carrier.name])
      );
      const cabinClass = seg.passengers[0].cabin_class;
      const totalDistanceInMiles = parseFloat(seg.distance) * 0.621371;

      return {
        offerId,
        flightNumber,
        departure: {
          cityName: seg.origin.city_name,
          airportCode: seg.origin.iata_code,
          airportName: seg.origin.name,
          timestamp: seg.departing_at,
          terminal: seg.origin_terminal || "",
          gate: "",
        },
        arrival: {
          cityName: seg.destination.city_name,
          airportCode: seg.destination.iata_code,
          airportName: seg.destination.name,
          timestamp: seg.arriving_at,
          terminal: seg.destination_terminal || "",
          gate: "",
        },
        airlines,
        cabinClass,
        totalDistanceInMiles,
        priceInEuros: offer.total_amount,
      };
    }
  });
}

export async function generateSampleSeatSelection({
  flightNumber,
}: {
  flightNumber: string;
}) {
  const { object: rows } = await generateObject({
    model: openai("gpt-4o-mini"),
    prompt: `Simulate available seats for flight number ${flightNumber}, 6 seats on each row and 5 rows in total, adjust pricing based on location of seat`,
    output: "array",
    schema: z.array(
      z.object({
        seatNumber: z.string().describe("Seat identifier, e.g., 12A, 15C"),
        priceInUSD: z
          .number()
          .describe("Seat price in Euros, less than 100EUR"),
        isAvailable: z
          .boolean()
          .describe("Whether the seat is available for booking"),
      })
    ),
  });

  return { seats: rows };
}
