import PassengerList from "@/components/Passengers/passenger-list";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { getPassengerInfo } from "@/db/passenger";

export default async function PassengersPage() {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session) {
    return <div>Not logged in</div>;
  }

  const passengers = await getPassengerInfo(session?.user.id);

  return <PassengerList passengers={passengers} />;
}
