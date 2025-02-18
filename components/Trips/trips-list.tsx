import { bookingSelectWithFlightAndAccommodation } from "@/db/booking";
import { WarpBackground } from "../warp-background";

export default function TripsList({
  bookings,
}: {
  bookings: bookingSelectWithFlightAndAccommodation[];
}) {
  console.log(bookings);
  return (
    <WarpBackground
      gridColor="var(--warp-border)"
      className="h-full border-[1px] border-black/5 dark:border-white/5 rounded-2xl w-full overflow-hidden flex items-center justify-center"
    >
      <div className="w-screen max-w-[70rem] z-10 bg-white dark:bg-jjBlack rounded-2xl p-6 border-[1px] border-black/5 dark:border-white/5">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-row items-start my-3 gap-4"
          >
            <h1>{booking.id}</h1>
            <div className="flex flex-col gap-0">
              {booking.booking_flights.map((flight) => (
                <h1 key={flight.id}>{flight.flightNumber}</h1>
              ))}
              {booking.booking_accommodations.map((accommodation) => (
                <h1 key={accommodation.id}>{accommodation.name}</h1>
              ))}
            </div>
          </div>
        ))}
      </div>
    </WarpBackground>
  );
}
