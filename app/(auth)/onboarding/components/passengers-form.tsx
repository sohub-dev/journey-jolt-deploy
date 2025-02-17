import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateTimePicker } from "@/components/datetime-picker";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { OnboardingData } from "../schema";
import { motion } from "framer-motion";

interface PassengersFormProps {
  form: UseFormReturn<OnboardingData>;
  fields: Record<"id", string>[];
  append: () => void;
  remove: (index: number) => void;
}

export function PassengersForm({
  form,
  fields,
  append,
  remove,
}: PassengersFormProps) {
  return (
    <div className="space-y-6">
      <CardHeader className="pl-2 pb-0 pt-0">
        <CardTitle className="font-medium tracking-tight text-2xl p-0">
          Add Passengers
        </CardTitle>
        <CardDescription className="text-base text-black/60 dark:text-white/60 tracking-tight">
          Add the passengers you want to be <br /> able to book trips for (eg.
          children, parents, etc.)
        </CardDescription>
      </CardHeader>

      <motion.div
        transition={{
          duration: 0.8,
          ease: [0.175, 0.885, 0.32, 1],
        }}
        className="h-full max-h-[40vh] overflow-y-auto flex flex-col gap-6 px-2"
      >
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-5 border-[1px] border-black/10 dark:border-white/10 rounded-xl space-y-4"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-base tracking-tight text-muted-foreground">
                Passenger {index + 1}
              </span>
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`passengers.${index}.firstName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`passengers.${index}.lastName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`passengers.${index}.nationality`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`passengers.${index}.passportNumber`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`passengers.${index}.passportExpiry`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport Expiry</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        hideTime
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`passengers.${index}.dateOfBirth`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        hideTime
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </motion.div>
      <Button type="button" onClick={() => append()}>
        Add another passenger
      </Button>
    </div>
  );
}
