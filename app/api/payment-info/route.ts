// app/api/payment-info/[userId]/route.ts
import { db } from "@/db";
import { paymentInfo } from "@/db/schema";
import { authClient } from "@/lib/auth-client";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { data: session } = await authClient.getSession({
      fetchOptions: {
        headers: await headers(),
      },
    });

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const passengers = await db
      .select({ magicWord: paymentInfo.magicWord })
      .from(paymentInfo)
      .where(eq(paymentInfo.userId, userId as string));

    return NextResponse.json(passengers);
  } catch (error) {
    console.error("[PAYMENT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
