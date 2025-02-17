import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "./lib/auth";
import { env } from "./lib/env";
export default async function middleware(request: NextRequest) {
  // Add a new header x-current-path which passes the path to downstream components
  const headers = new Headers(request.headers);
  const pathname = request.nextUrl.pathname;
  const data = await fetch(`${env.BETTER_AUTH_URL}/api/auth/get-session`, {
    headers: headers,
  });
  const session = await data.json();
  headers.set("x-current-path", pathname);

  if (
    !!session &&
    !session.user.onboarding_complete &&
    pathname !== "/onboarding"
  ) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }
  return NextResponse.next({ headers });
}

export const config = {
  matcher: [
    // match all routes except static files and APIs
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
