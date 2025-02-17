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

interface MagicWordFormProps {
  form: UseFormReturn<OnboardingData>;
}

export function MagicWordForm({ form }: MagicWordFormProps) {
  return (
    <div className="space-y-0">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Magic Word</CardTitle>
        <CardDescription className="text-base text-black/60 dark:text-white/60 tracking-tight">
          Set a magic word that will be used to confirm <br />
          your identity when you book a trip.
        </CardDescription>
      </CardHeader>

      <FormField
        control={form.control}
        name="magicWord"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Enter your magic word</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
