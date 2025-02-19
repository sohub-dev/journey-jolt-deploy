import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import { getUpcomingAndCurrentTripsInfo } from "@/db/services/booking";

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

  const tripsInfo = await getUpcomingAndCurrentTripsInfo(session.user.id);

  return <TripsList trips={tripsInfo} />;
}
