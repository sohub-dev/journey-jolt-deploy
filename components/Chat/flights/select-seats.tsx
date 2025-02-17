"use client";

import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";

interface Seat {
  seatNumber: string;
  priceInUSD: number;
  isAvailable: boolean;
}

const SAMPLE: { seats: Seat[][] } = {
  seats: [
    [
      { seatNumber: "1A", priceInUSD: 150, isAvailable: false },
      { seatNumber: "1B", priceInUSD: 150, isAvailable: false },
      { seatNumber: "1C", priceInUSD: 150, isAvailable: false },
      { seatNumber: "1D", priceInUSD: 150, isAvailable: false },
      { seatNumber: "1E", priceInUSD: 150, isAvailable: false },
      { seatNumber: "1F", priceInUSD: 150, isAvailable: false },
    ],
    [
      { seatNumber: "2A", priceInUSD: 150, isAvailable: true },
      { seatNumber: "2B", priceInUSD: 150, isAvailable: true },
      { seatNumber: "2C", priceInUSD: 150, isAvailable: true },
      { seatNumber: "2D", priceInUSD: 150, isAvailable: true },
      { seatNumber: "2E", priceInUSD: 150, isAvailable: false },
      { seatNumber: "2F", priceInUSD: 150, isAvailable: false },
    ],
    [
      { seatNumber: "3A", priceInUSD: 150, isAvailable: false },
      { seatNumber: "3B", priceInUSD: 150, isAvailable: false },
      { seatNumber: "3C", priceInUSD: 150, isAvailable: false },
      { seatNumber: "3D", priceInUSD: 150, isAvailable: false },
      { seatNumber: "3E", priceInUSD: 150, isAvailable: false },
      { seatNumber: "3F", priceInUSD: 150, isAvailable: false },
    ],
    [
      { seatNumber: "4A", priceInUSD: 150, isAvailable: false },
      { seatNumber: "4B", priceInUSD: 150, isAvailable: true },
      { seatNumber: "4C", priceInUSD: 150, isAvailable: true },
      { seatNumber: "4D", priceInUSD: 150, isAvailable: true },
      { seatNumber: "4E", priceInUSD: 150, isAvailable: true },
      { seatNumber: "4F", priceInUSD: 150, isAvailable: true },
    ],
    [
      { seatNumber: "5A", priceInUSD: 150, isAvailable: false },
      { seatNumber: "5B", priceInUSD: 150, isAvailable: false },
      { seatNumber: "5C", priceInUSD: 150, isAvailable: false },
      { seatNumber: "5D", priceInUSD: 150, isAvailable: false },
      { seatNumber: "5E", priceInUSD: 150, isAvailable: false },
      { seatNumber: "5F", priceInUSD: 150, isAvailable: false },
    ],
  ],
};

export function SelectSeats({
  chatId,
  availability = SAMPLE,
}: {
  chatId: string;
  availability?: typeof SAMPLE;
}) {
  const { append } = useChat({
    id: chatId,
    body: { id: chatId },
    maxSteps: 5,
  });

  return (
    <div className="flex flex-col gap-2 bg-muted rounded-lg bg-jjBlack/[0.04] dark:bg-white/[0.04] w-fit">
      <div className="flex flex-col gap-4 scale-75">
        <div className="flex flex-row w-full justify-between text-muted-foreground">
          <div className="flex flex-row">
            <div className="w-[45px] sm:w-[54px] text-center">A</div>
            <div className="w-[45px] sm:w-[54px] text-center">B</div>
            <div className="w-[45px] sm:w-[54px] text-center">C</div>
          </div>
          <div className="flex flex-row">
            <div className="w-[45px] sm:w-[54px] text-center">D</div>
            <div className="w-[45px] sm:w-[54px] text-center">E</div>
            <div className="w-[45px] sm:w-[54px] text-center">F</div>
          </div>
        </div>

        {availability.seats.map((row, index) => (
          <div
            key={`row-${index}`}
            data-row={index}
            className="flex flex-row gap-4"
          >
            {row.map((seat, seatIndex) => (
              <>
                {seatIndex === 3 ? (
                  <div className="flex flex-row items-center justify-center w-full text-muted-foreground px-8">
                    {index + 1}
                  </div>
                ) : null}
                <div
                  key={seat.seatNumber}
                  onClick={() => {
                    append({
                      role: "user",
                      content: `I'd like to go with seat ${seat.seatNumber}`,
                    });
                  }}
                  className={cn(
                    "cursor-pointer group relative size-8 sm:size-10 flex-shrink-0 flex rounded-sm flex-row items-center justify-center",
                    seat.isAvailable
                      ? "bg-jjBlue hover:bg-green-500"
                      : "bg-gray-500 cursor-not-allowed"
                  )}
                >
                  <div className="text-xs text-white">${seat.priceInUSD}</div>
                  <div
                    className={cn(
                      "absolute -top-1 h-2 w-full scale-125 rounded-sm",
                      seat.isAvailable
                        ? "bg-blue-600 group-hover:bg-green-600"
                        : "bg-zinc-600 cursor-not-allowed"
                    )}
                  />
                </div>
              </>
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-row gap-4 justify-center pb-6">
        <div className="flex flex-row items-center gap-2">
          <div className="size-4 bg-jjBlue rounded-sm" />
          <div className="text text-muted-foreground font-medium text-sm">
            Available
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="size-4 bg-gray-500 rounded-sm" />
          <div className="text text-muted-foreground font-medium text-sm">
            Unavailable
          </div>
        </div>
      </div>
    </div>
  );
}
