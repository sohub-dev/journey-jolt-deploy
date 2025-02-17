import React from "react";
import {
  Building2,
  MapPin,
  Star,
  Wifi,
  WavesLadder,
  Heater,
  Dumbbell,
  Utensils,
  CircleParking,
} from "lucide-react";
import { format } from "date-fns";
import { useChat } from "@ai-sdk/react";
const mockAccommodations = {
  accommodations: [
    {
      id: "acc1",
      name: "Grand Plaza Hotel",
      location: {
        city: "Rome",
        area: "City Center",
        distance: "0.2km from Colosseum",
      },
      type: "Hotel",
      amenities: ["wifi", "pool", "spa"],
      checkIn: "2024-03-15T15:00:00",
      checkOut: "2024-03-20T11:00:00",
      rating: 4.5,
      pricePerNight: 185,
      currency: "EUR",
    },
    {
      id: "acc2",
      name: "Riverside Apartments",
      location: {
        city: "Rome",
        area: "Trastevere",
        distance: "0.5km from River Tiber",
      },
      type: "Apartment",
      amenities: ["wifi", "kitchen"],
      checkIn: "2024-03-15T14:00:00",
      checkOut: "2024-03-20T10:00:00",
      rating: 4.2,
      pricePerNight: 150,
      currency: "EUR",
    },
    {
      id: "acc3",
      name: "Historic Boutique Hotel",
      location: {
        city: "Rome",
        area: "Vatican",
        distance: "0.3km from St. Peter's Basilica",
      },
      type: "Boutique Hotel",
      amenities: ["wifi", "restaurant"],
      checkIn: "2024-03-15T15:00:00",
      checkOut: "2024-03-20T11:00:00",
      rating: 4.8,
      pricePerNight: 220,
      currency: "EUR",
    },
  ],
};

export function ListAccommodations({
  chatId,
  results = mockAccommodations,
}: {
  chatId: string;
  results?: typeof mockAccommodations;
}) {
  const { append } = useChat({
    id: chatId,
    body: { id: chatId },
    maxSteps: 5,
  });
  return (
    <div className="w-fit bg-white dark:bg-zinc-900 rounded-lg">
      {results.accommodations.map((accommodation) => (
        <div
          key={accommodation.id}
          onClick={() => {
            append({
              role: "user",
              content: `I would like to book the ${accommodation.name} one with id ${accommodation.id}!`,
            });
          }}
          className="cursor-pointer gap-32 flex flex-row border-b dark:border-zinc-700 p-4 last-of-type:border-none group "
        >
          <div className="flex flex-col w-full gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex flex-row items-center gap-2 text-base font-medium group-hover:underline">
                <Building2
                  size={20}
                  className="text-zinc-500 dark:text-zinc-400"
                />
                <span className="text">{accommodation.name}</span>
              </div>

              <div className="flex flex-row items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                <MapPin
                  size={16}
                  className="text-zinc-500 dark:text-zinc-400"
                />
                <span className="text">{accommodation.location.area}</span>
                <span className="text-zinc-400 dark:text-zinc-500 px-2">•</span>
                <span className="text-zinc-500">
                  {accommodation.location.distance}
                </span>
              </div>
            </div>

            <div className="flex flex-row gap-3 text-sm text-zinc-600 dark:text-zinc-400 skeleton-div">
              {accommodation.amenities.includes("wifi") && (
                <span className="flex items-center gap-1">
                  <Wifi size={16} />
                  <span>Free WiFi</span>
                </span>
              )}
              {accommodation.amenities.includes("pool") && (
                <div className="flex items-center gap-1">
                  <WavesLadder size={16} />
                  <span>Pool</span>
                </div>
              )}
              {accommodation.amenities.includes("kitchen") && (
                <div className="flex items-center gap-1">
                  <Heater size={16} />
                  <span>Kitchen</span>
                </div>
              )}
              {accommodation.amenities.includes("breakfast") && (
                <div className="flex items-center gap-1">
                  <Utensils size={16} />
                  <span>Breakfast</span>
                </div>
              )}
              {accommodation.amenities.includes("parking") && (
                <div className="flex items-center gap-1">
                  <CircleParking size={16} />
                  <span>Parking</span>
                </div>
              )}
              {accommodation.amenities.includes("gym") && (
                <div className="flex items-center gap-1">
                  <Dumbbell size={16} />
                  <span>Gym</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 justify-between items-end">
            <div className="flex flex-row items-center gap-1">
              <Star size={16} className="text-yellow-400" />
              <span className="font-medium text skeleton-div">
                {accommodation.rating}
              </span>
            </div>

            <div className="flex flex-col items-end">
              <div className="text-lg font-medium text-emerald-600 dark:text-emerald-500">
                {accommodation.pricePerNight}€
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                per night
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
