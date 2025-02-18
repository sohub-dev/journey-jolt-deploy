import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import { getBookings } from "@/db/booking";
import TripsList from "@/components/Trips/trips-list";
export default async function TripsPage() {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session) {
    return <div>Not logged in</div>;
  }

  const bookings = await getBookings(session.user.id);

  return <TripsList bookings={bookings} />;
}
