"use client";

import { TripInfo } from "@/db/services/booking";
import { WarpBackground } from "../warp-background";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import Link from "next/link";
import TripItem from "./trip-item";

export default function TripsList({ trips }: { trips: TripInfo[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <WarpBackground
      gridColor="var(--warp-border)"
      wrapperClassName="w-full flex items-center justify-center"
      className="h-full border-[1px] border-black/5 dark:border-white/5 rounded-2xl w-full overflow-hidden flex items-center justify-center"
    >
      <div className="w-full max-w-5xl mt-16 bg-white dark:bg-jjBlack rounded-2xl overflow-hidden border-[1px] border-jjBlack/10 dark:border-white/10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10">
              <th className="p-4 text-left font-medium">Trip</th>
              <th className="p-4 text-right font-medium">Start Date</th>
              <th className="p-4 text-right font-medium">Total Price</th>
              <th className="p-4 text-right font-medium">More Info</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {trips.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4">
                    <div className="flex items-center justify-center pt-8">
                      No bookings found
                    </div>
                    <div className="flex items-center justify-center pb-8">
                      <Link
                        href="/dashboard/chat"
                        className="text-blue-500 hover:text-blue-600 hover:underline"
                      >
                        Start a new chat to book a trip.
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
              {trips.map((trip) => (
                <TripItem
                  key={trip.bookingInfo.id}
                  trip={trip}
                  isExpanded={expandedId === trip.bookingInfo.id}
                  onToggle={() =>
                    setExpandedId(
                      expandedId === trip.bookingInfo.id
                        ? null
                        : trip.bookingInfo.id
                    )
                  }
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </WarpBackground>
  );
}
