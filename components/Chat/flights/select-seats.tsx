"use client";

import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";

interface Seat {
  seatNumber: string;
  priceInEuros: number;
  isAvailable: boolean;
}

const SAMPLE: { seats: Seat[][] } = {
  seats: [
    [
      { seatNumber: "1A", priceInEuros: 150, isAvailable: false },
      { seatNumber: "1B", priceInEuros: 150, isAvailable: false },
      { seatNumber: "1C", priceInEuros: 150, isAvailable: false },
      { seatNumber: "1D", priceInEuros: 150, isAvailable: false },
      { seatNumber: "1E", priceInEuros: 150, isAvailable: false },
      { seatNumber: "1F", priceInEuros: 150, isAvailable: false },
    ],
    [
      { seatNumber: "2A", priceInEuros: 150, isAvailable: false },
      { seatNumber: "2B", priceInEuros: 150, isAvailable: false },
      { seatNumber: "2C", priceInEuros: 150, isAvailable: false },
      { seatNumber: "2D", priceInEuros: 150, isAvailable: false },
      { seatNumber: "2E", priceInEuros: 150, isAvailable: false },
      { seatNumber: "2F", priceInEuros: 150, isAvailable: false },
    ],
    [
      { seatNumber: "3A", priceInEuros: 150, isAvailable: false },
      { seatNumber: "3B", priceInEuros: 150, isAvailable: false },
      { seatNumber: "3C", priceInEuros: 150, isAvailable: false },
      { seatNumber: "3D", priceInEuros: 150, isAvailable: false },
      { seatNumber: "3E", priceInEuros: 150, isAvailable: false },
      { seatNumber: "3F", priceInEuros: 150, isAvailable: false },
    ],
    [
      { seatNumber: "4A", priceInEuros: 150, isAvailable: false },
      { seatNumber: "4B", priceInEuros: 150, isAvailable: false },
      { seatNumber: "4C", priceInEuros: 150, isAvailable: false },
      { seatNumber: "4D", priceInEuros: 150, isAvailable: false },
      { seatNumber: "4E", priceInEuros: 150, isAvailable: false },
      { seatNumber: "4F", priceInEuros: 150, isAvailable: false },
    ],
    [
      { seatNumber: "5A", priceInEuros: 150, isAvailable: false },
      { seatNumber: "5B", priceInEuros: 150, isAvailable: false },
      { seatNumber: "5C", priceInEuros: 150, isAvailable: false },
      { seatNumber: "5D", priceInEuros: 150, isAvailable: false },
      { seatNumber: "5E", priceInEuros: 150, isAvailable: false },
      { seatNumber: "5F", priceInEuros: 150, isAvailable: false },
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
                  <div className="text-xs text-white">${seat.priceInEuros}</div>
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
