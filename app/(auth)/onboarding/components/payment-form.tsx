import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { OnboardingData } from "../schema";

interface PaymentFormProps {
  form: UseFormReturn<OnboardingData>;
}

export function PaymentForm({ form }: PaymentFormProps) {
  return (
    <div className="space-y-6 w-full">
      <CardHeader className="pl-2 pb-0 pt-0">
        <CardTitle className="font-medium tracking-tight text-2xl p-0">
          Payment Information
        </CardTitle>
        <CardDescription className="text-base text-black/60 dark:text-white/60 tracking-tight">
          Add your payment information that will be <br /> used to pay for your
          bookings
        </CardDescription>
      </CardHeader>

      <FormField
        control={form.control}
        name="paymentInfo.cardNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Card Number</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="paymentInfo.expiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <FormControl>
                <Input
                  pattern="d{2}/d{2}"
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    const inputValue = input.value;
                    //@ts-expect-error
                    if (e.keyCode == 8 && inputValue.includes("/")) {
                      //@ts-expect-error
                      e.location = 2;
                    }
                    if (inputValue.length === 2 && !inputValue.includes("/")) {
                      input.value = inputValue + "/";
                    }
                  }}
                  placeholder="MM/YY"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentInfo.cvv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CVV</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
