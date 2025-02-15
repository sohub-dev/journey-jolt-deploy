"use client";

import { SiteHeader } from "@/components/Home/site-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Footer } from "@/components/Home/footer";
import { Zap, Command, Bot, Shield, Sparkles, Check } from "lucide-react";
import Link from "next/link";
import Orb from "@/components/orb";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center">
      <main className="flex-1 justify-center">
        <section className="flex min-h-screen flex-col items-center justify-center space-y-10 py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container flex flex-col items-center justify-center gap-6 text-center"
          >
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              href="#"
              className="inline-flex items-center rounded-full backdrop-blur bg-black/[0.04] px-4 py-1.5 text-sm font-medium z-10 pointer-events-none"
            >
              🎉 <Separator className="mx-2 h-4" orientation="vertical" />{" "}
              Introducing JourneyJolt
            </motion.a>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-medium leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1] z-10 pointer-events-none"
            >
              Book Your Next
              <br />
              Adventure in Minutes
            </motion.h1>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl z-10 pointer-events-none"
            >
              JourneyJolt is an AI travel agent that helps you plan your trips,
              book your flights, and find the best places to stay.
            </motion.span>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 z-10"
            >
              <Button size="lg" className="h-12 px-8" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8">
                View Demo
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] z-0"
          >
            <Orb className="w-full h-full" />
          </motion.div>
        </section>

        <Separator className="my-12" />

        <section className="container space-y-12 py-12 md:py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
          >
            <h2 className="text-3xl font-medium tracking-tighter leading-[1.1] sm:text-3xl md:text-5xl">
              Our Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              JourneyJolt is a powerful AI travel agent that helps you plan your
              trips, book your flights, and find the best places to stay.
            </p>
          </motion.div>
          <div className="mx-auto grid gap-8 sm:max-w-3xl sm:grid-cols-2 lg:max-w-5xl lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  rotateX: index % 2 === 0 ? 5 : -5,
                  rotateY: index % 3 === 0 ? 5 : -5,
                  transition: { duration: 0.3 },
                }}
                className="relative overflow-hidden rounded-lg border bg-background p-2"
              >
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <feature.icon
                    strokeWidth={1.3}
                    className="h-12 w-12 text-primary"
                  />
                  <div className="space-y-2">
                    <h3 className="font-medium tracking-tight">
                      {feature.name}
                    </h3>
                    <p className="text-sm tracking-tight text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        <section id="pricing" className="container py-12 md:py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
          >
            <h2 className="text-3xl font-medium tracking-tighter leading-[1.1] sm:text-3xl md:text-5xl">
              Simple, transparent pricing
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Choose the plan that's right for you and start planning your next
              trip.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col overflow-hidden rounded-lg border bg-background"
              >
                <div className="p-6">
                  <h3 className="text-2xl font-medium tracking-tight">
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline text-3xl font-medium tracking-tight">
                    ${plan.price}
                    <span className="ml-1 text-xl font-normal text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="mr-2 h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-8 w-full">{plan.buttonText}</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        <section className="container py-12 md:py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
          >
            <h2 className="text-3xl font-medium tracking-tighter leading-[1.1] sm:text-3xl md:text-5xl">
              Ready to get started?
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Book your next trip in minutes.
            </p>
            <Button size="lg" className="mt-4" asChild>
              <Link href="/signup">Get Started Now</Link>
            </Button>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

const features = [
  {
    name: "Easy Booking",
    description:
      "Book your flights, hotels, and rental cars with our intuitive interface.",
    icon: Zap,
  },
  {
    name: "Customizable",
    description: "Customize your trip to your liking.",
    icon: Command,
  },
  {
    name: "AI-Powered",
    description:
      "Leverage artificial intelligence to create smarter responses.",
    icon: Bot,
  },
  {
    name: "Best Deals",
    description: "Find the best deals on flights, hotels, and rental cars.",
    icon: Bot,
  },
  {
    name: "Enterprise Security",
    description: "Bank-grade security to protect your data.",
    icon: Shield,
  },
  {
    name: "Best Places to Stay",
    description: "Find the best places to stay on your trip.",
    icon: Sparkles,
  },
] as const;

const pricingPlans = [
  {
    name: "Free",
    price: 0,
    description: "For those who want to try JourneyJolt.",
    features: [
      "Book your flights, hotels, and rental cars.",
      "Find the best deals on flights, hotels, and rental cars.",
      "Find the best places to stay on your trip.",
    ],
    buttonText: "Start for Free",
  },
  {
    name: "Pro",
    price: 8,
    description: "For those who want to use JourneyJolt.",
    features: [
      "Book your flights, hotels, and rental cars.",
      "Find the best deals on flights, hotels, and rental cars.",
      "Find the best places to stay on your trip.",
    ],
    buttonText: "Upgrade to Pro",
  },
] as const;
