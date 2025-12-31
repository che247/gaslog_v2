-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."fuel_logs" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "odometer" DECIMAL(5,2) NOT NULL,
    "total_cost" DECIMAL(5,2) NOT NULL,
    "gallons" DECIMAL(6,3) NOT NULL,
    "gas_station" TEXT NOT NULL,
    "price_per_gallon" DECIMAL(4,2),
    "notes" TEXT,

    CONSTRAINT "fuel_logs_pkey" PRIMARY KEY ("id")
);

