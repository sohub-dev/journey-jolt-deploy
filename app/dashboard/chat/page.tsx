import { generateUUID } from "@/lib/utils";
import { Chat } from "@/components/Chat";

const UIFlag = true;

export default async function ChatPage() {
  const id = generateUUID();
  const initialMessagesTest = [
    {
      id: generateUUID(),
      role: "assistant",
      content: "Here are some available flights:",
      toolInvocations: [
        {
          toolName: "searchFlights",
          toolCallId: generateUUID(),
          state: "result",
        },
      ],
    },
    {
      id: generateUUID(),
      role: "assistant",
      content: "Here are some available seats:",
      toolInvocations: [
        {
          toolName: "selectSeats",
          toolCallId: generateUUID(),
          state: "result",
          result: {
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
          },
        },
      ],
    },
    {
      id: generateUUID(),
      role: "assistant",
      content: "Here is the reservation:",
      toolInvocations: [
        {
          toolName: "displayReservation",
          toolCallId: generateUUID(),
          state: "result",
          result: {
            offerId: "offer_123",
            seats: ["4C"],
            flightNumber: "EK413",
            departure: {
              cityName: "Sydney",
              airportCode: "SYD",
              timestamp: "2023-11-01T06:00:00",
              gate: "A12",
              terminal: "1",
            },
            arrival: {
              cityName: "Chennai",
              airportCode: "MAA",
              timestamp: "2023-11-01T18:45:00",
              gate: "B5",
              terminal: "3",
            },
            passengerName: "John Doe",
            totalPriceInEuros: 1200,
          },
        },
      ],
    },
    {
      id: generateUUID(),
      role: "assistant",
      content: "Here is the payment:",
      toolInvocations: [
        {
          toolName: "authorizePayment",
          toolCallId: generateUUID(),
          state: "result",
          result: {
            reservationId: "reservation_test1",
          },
        },
      ],
    },
    {
      id: generateUUID(),
      role: "assistant",
      content: "Here is the boarding pass:",
      toolInvocations: [
        {
          toolName: "displayBoardingPass",
          toolCallId: generateUUID(),
          state: "result",
        },
      ],
    },
  ];
  return (
    <Chat
      key={id}
      id={id}
      initialMessages={UIFlag ? initialMessagesTest : []}
    />
  );
}
