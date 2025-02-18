import {
  bookingSelectWithFlightAndAccommodation,
  TripInfo,
} from "@/db/booking";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useState, createContext, useContext } from "react";
import {
  ChevronDown,
  HotelIcon,
  PlaneIcon,
  Star,
  PlaneTakeoff,
  PlaneLanding,
  User,
  MapPin,
  Building2,
  Heater,
  WavesLadder,
  Wifi,
  Utensils,
  CircleParking,
  Dumbbell,
} from "lucide-react";
import { DisplayBoardingPass } from "../Chat/flights/boarding-pass";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { bookingFlight, passenger } from "@/db/schema";

// Context for managing expanded state across all trip items
const ExpandedContext = createContext<{
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}>({
  expandedId: null,
  setExpandedId: () => {},
});

// Helper function to determine the earliest date from flights and accommodations
function getEarliestOverallDate(flights: any, accommodations: any) {
  // Get earliest flight date if flights exist
  const earliestFlightDate =
    flights.length > 0
      ? flights.reduce((earliest: any, flight: any) => {
          return flight.departureDateTime < earliest
            ? flight.departureDateTime
            : earliest;
        }, flights[0].departureDateTime)
      : null;

  // Get earliest accommodation date if accommodations exist
  const earliestCheckInDate =
    accommodations.length > 0
      ? accommodations.reduce((earliest: any, accommodation: any) => {
          return accommodation.checkInDate < earliest
            ? accommodation.checkInDate
            : earliest;
        }, accommodations[0].checkInDate)
      : null;

  // Return the earlier of the two dates, or whichever exists
  if (earliestFlightDate && earliestCheckInDate) {
    return earliestFlightDate < earliestCheckInDate
      ? earliestFlightDate
      : earliestCheckInDate;
  }
  return earliestFlightDate || earliestCheckInDate;
}

// Wrapper component to provide expanded state context
export function TripList({ trips }: { trips: TripInfo[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <ExpandedContext.Provider value={{ expandedId, setExpandedId }}>
      <tbody>
        {trips.map((trip) => (
          <TripItem key={trip.bookingInfo.id} trip={trip} isExpanded={false} onToggle={function (): void {
            throw new Error("Function not implemented.");
          } } />
        ))}
      </tbody>
    </ExpandedContext.Provider>
  );
}

export default function TripItem({
  trip,
  isExpanded,
  onToggle,
}: {
  trip: TripInfo;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { expandedId, setExpandedId } = useContext(ExpandedContext);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const earliestDate = getEarliestOverallDate(
    trip.bookingFlights,
    trip.bookingAccommodations
  );

  // Calculate total price for all flights
  const totalPriceFlights = trip.bookingFlights.reduce(
    (total: number, flight: any) => total + parseFloat(flight.priceAmount),
    0
  );

  // Calculate total price for all accommodations
  const totalPriceAccommodations = trip.bookingAccommodations.reduce(
    (total: number, accommodation: any) => {
      const pricePerNight = parseFloat(accommodation.pricePerNight);
      const checkInDate = new Date(accommodation.checkInDate);
      const checkOutDate = new Date(accommodation.checkOutDate);
      const nights =
        (checkOutDate.getTime() - checkInDate.getTime()) /
        (1000 * 60 * 60 * 24);
      return total + pricePerNight * nights;
    },
    0
  );

  const totalPriceFormatted = (
    totalPriceFlights + totalPriceAccommodations
  ).toFixed(2);

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        onClick={onToggle}
        className="group relative cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      >
        <td className="p-4">
          <div className="flex items-center gap-3 w-fit">
            <div className="flex flex-col">
              <span>
                Trip to {trip.bookingInfo.destinationCity},{" "}
                {trip.bookingInfo.destinationCountry}
              </span>
              <span className="flex flex-row items-center mt-1 gap-1 text-black/60 dark:text-white/60">
                {trip.bookingInfo.bookingType === "flight" ? (
                  <PlaneIcon size={16} />
                ) : trip.bookingInfo.bookingType === "accommodation" ? (
                  <HotelIcon size={16} />
                ) : (
                  <>
                    <PlaneIcon size={16} />
                    <HotelIcon size={16} />
                  </>
                )}
              </span>
            </div>
          </div>
        </td>
        <td className="p-4 text-right">
          <span className="text-gray-900 dark:text-white">
            {format(earliestDate, "MMM d, yyyy")}
          </span>
        </td>
        <td className="p-4 text-right">
          <span className="text-gray-900 dark:text-white">
            {totalPriceFormatted} {trip.bookingInfo.currency}
          </span>
        </td>
        <td className="p-4 text-right">
          <button
            onClick={onToggle}
            className="inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <motion.div
              animate={{
                rotate: expandedId === trip.bookingInfo.id ? 180 : 0,
              }}
              transition={{ duration: 0.4 }}
            >
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </button>
        </td>
      </motion.tr>
      {isExpanded && (
        <motion.tr
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ overflow: "hidden" }}
        >
          <td
            colSpan={4}
            className="p-4 pt-0 bg-white dark:bg-jjBlack border-b-[1px] border-black/10 dark:border-white/10"
          >
            <div className="p-4">
              <h3 className="text-lg font-medium mb-4">Booking Details</h3>
              <div className="flex flex-col gap-2">
                <h4 className="font-medium mb-0">
                  Passenger{trip.passengerInfo.length > 1 ? "s" : ""}
                </h4>
                {trip.passengerInfo.map((passenger) => (
                  <div key={passenger.id}>
                    <div className="flex flex-col items-start">
                      <span>
                        {passenger.firstName} {passenger.lastName}
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400 no-skeleton">
                        Date of Birth:{" "}
                        {format(new Date(passenger.dateOfBirth), "MMM d, yyyy")}
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400 no-skeleton">
                        Nationality: {passenger.nationality}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {trip.bookingFlights.length > 0 && (
                <div className="my-4 flex flex-col gap-2">
                  <h4 className="font-medium mb-0">Flights</h4>
                  <div className="flex flex-row gap-12">
                    {trip.bookingFlights.map((flight) => (
                      <div
                        key={flight.id}
                        className="mb-2 flex flex-col text-gray-600 dark:text-white/70"
                      >
                        <div className="flex flex-row gap-1 items-center">
                          <span className="text-zinc-500 dark:text-zinc-400 no-skeleton">
                            <PlaneTakeoff size={16} />
                          </span>
                          <span className="text">
                            {flight.departureAirport}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            (
                            {format(
                              new Date(flight.departureDateTime),
                              "h:mm a"
                            )}
                            ) -
                          </span>
                          <span className="text-zinc-500 dark:text-zinc-400 no-skeleton">
                            <PlaneLanding size={16} />
                          </span>
                          <span className="text">{flight.arrivalAirport}</span>
                          <span className="text-xs text-muted-foreground">
                            (
                            {format(new Date(flight.arrivalDateTime), "h:mm a")}
                            )
                          </span>
                        </div>
                        Flight Number: {flight.flightNumber}
                        <BoardingPassModal
                          flight={flight}
                          passengers={trip.passengerInfo}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {trip.bookingAccommodations.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Accommodations</h4>
                  {trip.bookingAccommodations.map((accommodation) => (
                    <div
                      key={accommodation.id}
                      className="cursor-pointer w-fit gap-20 flex flex-row py-2"
                    >
                      <div className="flex flex-col w-full gap-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-row items-center gap-2 text-base font-medium group-hover:underline">
                            <Building2
                              size={20}
                              className="text-zinc-500 dark:text-zinc-400"
                            />
                            <span className="text">{accommodation.name}</span>
                          </div>

                          <div className="flex flex-row items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                            <div className="flex flex-row items-center gap-1 mr-2">
                              <Star size={16} className="text-yellow-400" />
                              <span className="font-medium text skeleton-div">
                                {accommodation.starRating}
                              </span>
                            </div>
                            <MapPin
                              size={16}
                              className="text-zinc-500 dark:text-zinc-400"
                            />
                            <span className="text">{accommodation.city}</span>
                            <span className="text-zinc-400 dark:text-zinc-500 px-2">
                              •
                            </span>
                            <span className="text-zinc-500">
                              {accommodation.country}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 justify-between items-end">
                        <div className="flex flex-col items-end">
                          <div className="text-lg font-medium text-emerald-600 dark:text-emerald-500">
                            {accommodation.pricePerNight}€
                          </div>
                          <div className="text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                            per night
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </td>
        </motion.tr>
      )}
    </>
  );
}

function BoardingPassModal({
  flight,
  passengers,
}: {
  flight: typeof bookingFlight.$inferSelect;
  passengers: (typeof passenger.$inferSelect)[];
}) {
  const data = {
    departure: {
      cityName: flight.departureAirport,
      airportCode: flight.departureAirport,
      airportName: flight.departureAirport,
      timestamp: flight.departureDateTime,
      terminal: "N/A",
      gate: "N/A",
    },
    arrival: {
      cityName: flight.arrivalAirport,
      airportCode: flight.arrivalAirport,
      airportName: flight.arrivalAirport,
      timestamp: flight.arrivalDateTime,
      terminal: "N/A",
      gate: "N/A",
    },
    passengerName: "",
    flightNumber: flight.flightNumber,
    seat: "N/A",
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-2">
          View Boarding Pass
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="sr-only">Boarding Passes</DialogTitle>
        <div className="grid grid-cols-2 gap-4">
          {passengers.map((passenger) => (
            <DisplayBoardingPass
              key={passenger.id}
              boardingPass={{
                ...data,
                passengerName: `${passenger.firstName} ${passenger.lastName}`,
              }}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
