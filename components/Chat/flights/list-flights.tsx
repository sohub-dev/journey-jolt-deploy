"use client";

import { useChat } from "@ai-sdk/react";
import { differenceInHours, format } from "date-fns";
import { PlaneTakeoff, PlaneLanding } from "lucide-react";

const SAMPLE = {
  flights: [
    {
      offerId: "result_1",
      flightNumber: "UA123",
      departure: {
        cityName: "San Francisco",
        airportCode: "SFO",
        airportName: "San Francisco International Airport",
        timestamp: "2024-05-19T18:00:00Z",
        terminal: "3",
        gate: "F12",
      },
      connection: {
        airportCode: "FRA",
        airportName: "Frankfurt Airport",
        arrivalTimestamp: "2024-05-20T04:30:00Z",
        departureTimestamp: "2024-05-20T06:30:00Z",
      },
      arrival: {
        cityName: "Rome",
        airportCode: "FCO",
        airportName: "Leonardo da Vinci International Airport",
        timestamp: "2024-05-20T14:30:00Z",
        terminal: "1",
        gate: "B15",
      },
      airlines: ["United Airlines", "Lufthansa"],
      cabinClass: "economy",
      totalDistanceInMiles: 6854,
      priceInEuros: 1200.5,
    },
    {
      offerId: "result_2",
      flightNumber: "BA278",
      departure: {
        cityName: "San Francisco",
        airportCode: "SFO",
        airportName: "San Francisco International Airport",
        timestamp: "2024-05-19T17:30:00Z",
        terminal: "I",
        gate: "A8",
      },
      arrival: {
        cityName: "Rome",
        airportCode: "FCO",
        airportName: "Leonardo da Vinci International Airport",
        timestamp: "2024-05-20T15:00:00Z",
        terminal: "3",
        gate: "C22",
      },
      airlines: ["British Airways"],
      cabinClass: "business",
      totalDistanceInMiles: 6421,
      priceInEuros: 1350,
    },
    {
      offerId: "result_3",
      flightNumber: "DL456",
      departure: {
        cityName: "San Francisco",
        airportCode: "SFO",
        airportName: "San Francisco International Airport",
        timestamp: "2024-05-19T19:15:00Z",
        terminal: "2",
        gate: "D5",
      },
      connection: {
        airportCode: "CDG",
        airportName: "Charles de Gaulle Airport",
        arrivalTimestamp: "2024-05-20T05:45:00Z",
        departureTimestamp: "2024-05-20T07:45:00Z",
      },
      arrival: {
        cityName: "Rome",
        airportCode: "FCO",
        airportName: "Leonardo da Vinci International Airport",
        timestamp: "2024-05-20T16:45:00Z",
        terminal: "1",
        gate: "E12",
      },
      airlines: ["Delta Air Lines", "Air France"],
      cabinClass: "economy",
      totalDistanceInMiles: 6732,
      priceInEuros: 1150.75,
    },
    {
      offerId: "result_4",
      flightNumber: "AA789",
      departure: {
        cityName: "San Francisco",
        airportCode: "SFO",
        airportName: "San Francisco International Airport",
        timestamp: "2024-05-19T16:30:00Z",
        terminal: "1",
        gate: "B22",
      },
      connection: {
        airportCode: "MAD",
        airportName: "Adolfo Suárez Madrid–Barajas Airport",
        arrivalTimestamp: "2024-05-20T03:50:00Z",
        departureTimestamp: "2024-05-20T05:50:00Z",
      },
      arrival: {
        cityName: "Rome",
        airportCode: "FCO",
        airportName: "Leonardo da Vinci International Airport",
        timestamp: "2024-05-20T13:50:00Z",
        terminal: "2",
        gate: "D8",
      },
      airlines: ["American Airlines", "Iberia"],
      cabinClass: "economy",
      totalDistanceInMiles: 6589,
      priceInEuros: 1250.25,
    },
  ],
};

export function ListFlights({
  chatId,
  results = SAMPLE,
}: {
  chatId: string;
  results?: typeof SAMPLE;
}) {
  const { append } = useChat({
    id: chatId,
    body: { id: chatId },
    maxSteps: 5,
  });

  return (
    <div className="rounded-lg bg-jjBlack/[0.04] dark:bg-white/[0.04] px-4 py-1.5 flex flex-col min-w-fit w-fit">
      {results.flights.map((flight) => (
        <div
          key={flight.offerId}
          className="cursor-pointer gap-10 flex flex-row border-b dark:border-zinc-700 py-3 last-of-type:border-none group"
          onClick={() => {
            append({
              role: "user",
              content: `I would like to book the ${flight.airlines} one with id ${flight.offerId}!`,
            });
          }}
        >
          <div className="flex flex-col w-full gap-0.5 justify-between">
            <div className="flex flex-col gap-1">
              {flight.connection ? (
                <div className="flex flex-col gap-0.5 text-base sm:text-base font-medium group-hover:underline">
                  <div className="flex flex-row gap-0.5 items-center">
                    <div className="w-fit flex flex-row gap-1 items-center">
                      <span className="text-zinc-500 dark:text-zinc-400 no-skeleton">
                        <PlaneTakeoff size={16} />
                      </span>
                      <span className="text">
                        {flight.departure.airportCode}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {format(new Date(flight.departure.timestamp), "h:mm a")}
                        )
                      </span>
                    </div>
                    {flight.connection && (
                      <>
                        <div className="no-skeleton px-2">-</div>
                        <div className="flex flex-row gap-1 items-center">
                          <span className="text-zinc-500 dark:text-zinc-400 no-skeleton">
                            <PlaneLanding size={16} />
                          </span>
                          <span className="text">
                            {flight.connection.airportCode}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            (
                            {format(
                              new Date(flight.connection.arrivalTimestamp),
                              "h:mm a"
                            )}
                            )
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-row gap-0.5 items-center">
                    {flight.connection && (
                      <>
                        <div className="flex flex-row gap-1 items-center">
                          <span className="text-zinc-500 dark:text-zinc-400 no-skeleton">
                            <PlaneTakeoff size={16} />
                          </span>
                          <span className="text">
                            {flight.connection.airportCode}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            (
                            {format(
                              new Date(flight.connection.departureTimestamp),
                              "h:mm a"
                            )}
                            )
                          </span>
                        </div>
                        <div className="no-skeleton px-2">-</div>
                      </>
                    )}
                    <div className="flex flex-row gap-1 items-center">
                      <span className="text-zinc-500 dark:text-zinc-400 no-skeleton">
                        <PlaneLanding size={16} />
                      </span>
                      <span className="text">{flight.arrival.airportCode}</span>
                      <span className="text-xs text-muted-foreground">
                        ({format(new Date(flight.arrival.timestamp), "h:mm a")})
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-row items-center gap-0.5 text-base sm:text-base font-medium group-hover:underline">
                  <div className="w-fit flex flex-row gap-1 items-center">
                    <span className="text-zinc-500 dark:text-zinc-400 no-skeleton">
                      <PlaneTakeoff size={16} />
                    </span>
                    <span className="text">{flight.departure.airportCode}</span>

                    <span className="text-xs text-muted-foreground">
                      ({format(new Date(flight.departure.timestamp), "h:mm a")})
                    </span>
                  </div>
                  <div className="no-skeleton px-2">-</div>
                  <div className="flex flex-row gap-1 items-center">
                    <span className="text-zinc-500 dark:text-zinc-400 no-skeleton">
                      <PlaneLanding size={16} />
                    </span>
                    <span className="text">{flight.arrival.airportCode}</span>
                    <span className="text-xs text-muted-foreground">
                      ({format(new Date(flight.arrival.timestamp), "h:mm a")})
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="text w-fit hidden sm:flex text-sm text-black/60 dark:text-white/60 flex-row gap-2 mt-4">
              <div>{flight.airlines.join(" - ")}</div>
            </div>
            <div className="text sm:hidden text-xs sm:text-sm text-muted-foreground">
              {flight.connection ? "1 stop" : "Nonstop"}
            </div>
          </div>

          <div className="flex flex-col gap-0.5 justify-between">
            <div className="flex flex-row gap-2">
              <div className="text-base sm:text-base">
                {differenceInHours(
                  new Date(flight.arrival.timestamp),
                  new Date(flight.departure.timestamp)
                )}{" "}
                hr
              </div>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex flex-row gap-1">
              {flight.departure.cityName} - {flight.arrival.cityName}
            </div>
          </div>

          <div className="flex flex-col w-32 items-end justify-between gap-0.5">
            <div className="flex flex-row gap-2">
              <div className="text-base sm:text-base text-emerald-600 dark:text-emerald-500">
                {flight.priceInEuros}€
              </div>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground flex flex-row whitespace-nowrap">
              Round Trip
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
