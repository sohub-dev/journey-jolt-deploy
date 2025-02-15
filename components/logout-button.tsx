"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session;
  const router = useRouter();

  return (
    <Button
      className="fixed right-12 top-12"
      onClick={() => {
        if (isLoggedIn) {
          authClient.signOut();
        } else {
          router.push("/login");
        }
      }}
    >
      {isLoggedIn ? "Logout" : "Login"}
    </Button>
  );
}
