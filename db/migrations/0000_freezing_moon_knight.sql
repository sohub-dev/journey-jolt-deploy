CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"booking_reference" text NOT NULL,
	"booking_type" text NOT NULL,
	"status" text NOT NULL,
	"total_amount" numeric NOT NULL,
	"currency" text NOT NULL,
	"payment_status" text NOT NULL,
	"booking_date" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "booking_booking_reference_unique" UNIQUE("booking_reference")
);
--> statement-breakpoint
CREATE TABLE "booking_flight" (
	"id" text PRIMARY KEY NOT NULL,
	"booking_id" text NOT NULL,
	"flight_id" text NOT NULL,
	"cabin_class" text NOT NULL,
	"price_amount" numeric NOT NULL,
	"price_currency" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking_hotel" (
	"id" text PRIMARY KEY NOT NULL,
	"booking_id" text NOT NULL,
	"hotel_room_id" text NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"country" text NOT NULL,
	"star_rating" integer,
	"check_in_date" text NOT NULL,
	"check_out_date" text NOT NULL,
	"number_of_rooms" integer NOT NULL,
	"price_per_night" numeric NOT NULL,
	"price_currency" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking_passenger" (
	"id" text PRIMARY KEY NOT NULL,
	"booking_id" text NOT NULL,
	"passenger_id" text NOT NULL,
	"is_primary" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flight" (
	"id" text PRIMARY KEY NOT NULL,
	"flight_number" text NOT NULL,
	"airline" text NOT NULL,
	"departure_airport" text NOT NULL,
	"arrival_airport" text NOT NULL,
	"departure_time" text NOT NULL,
	"arrival_time" text NOT NULL,
	"aircraft_type" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotel_room" (
	"id" text PRIMARY KEY NOT NULL,
	"room_type" text NOT NULL,
	"description" text,
	"max_occupancy" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "passenger" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"date_of_birth" text NOT NULL,
	"nationality" text NOT NULL,
	"passport_number" text NOT NULL,
	"passport_expiry" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "passenger_flight" (
	"id" text PRIMARY KEY NOT NULL,
	"booking_flight_id" text NOT NULL,
	"passenger_id" text NOT NULL,
	"seat_number" text,
	"baggage_allowance" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "passenger_room" (
	"id" text PRIMARY KEY NOT NULL,
	"booking_hotel_id" text NOT NULL,
	"passenger_id" text NOT NULL,
	"is_primary_guest" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_info" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" varchar(255),
	"encrypted_card_number" text,
	"iv" text,
	"card_type" varchar(50),
	"last4" varchar(4),
	"created_at" timestamp(3) DEFAULT now(),
	"updated_at" timestamp(3) DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_flight" ADD CONSTRAINT "booking_flight_booking_id_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_flight" ADD CONSTRAINT "booking_flight_flight_id_flight_id_fk" FOREIGN KEY ("flight_id") REFERENCES "public"."flight"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_hotel" ADD CONSTRAINT "booking_hotel_booking_id_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_hotel" ADD CONSTRAINT "booking_hotel_hotel_room_id_hotel_room_id_fk" FOREIGN KEY ("hotel_room_id") REFERENCES "public"."hotel_room"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_passenger" ADD CONSTRAINT "booking_passenger_booking_id_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_passenger" ADD CONSTRAINT "booking_passenger_passenger_id_passenger_id_fk" FOREIGN KEY ("passenger_id") REFERENCES "public"."passenger"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passenger" ADD CONSTRAINT "passenger_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passenger_flight" ADD CONSTRAINT "passenger_flight_booking_flight_id_booking_flight_id_fk" FOREIGN KEY ("booking_flight_id") REFERENCES "public"."booking_flight"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passenger_flight" ADD CONSTRAINT "passenger_flight_passenger_id_passenger_id_fk" FOREIGN KEY ("passenger_id") REFERENCES "public"."passenger"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passenger_room" ADD CONSTRAINT "passenger_room_booking_hotel_id_booking_hotel_id_fk" FOREIGN KEY ("booking_hotel_id") REFERENCES "public"."booking_hotel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passenger_room" ADD CONSTRAINT "passenger_room_passenger_id_passenger_id_fk" FOREIGN KEY ("passenger_id") REFERENCES "public"."passenger"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_info" ADD CONSTRAINT "payment_info_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;