import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import logger from "morgan";
import path, { dirname, join } from "path";
import { pagination } from "prisma-extension-pagination";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";

const prisma = new PrismaClient().$extends(pagination());
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// *************************************************** //
app.get("/api/logs", async (req, res) => {
  const limit = 5;
  console.log("Got the req parameters: ", req.query);
  const after = req.query.afterID ? String(req.query.afterID) : 0;
  try {
    const [logs, meta] = await prisma.fuel_log.paginate({ orderBy: { date: "desc" } }).withCursor({
      limit,
      after,
    });
    res.status(200).json({ data: logs, meta: meta });
  } catch {
    console.log("Unable to querry database for logs... Try again later.");
    res.status(500).json({ error: "Unable to retrieve gas logs. Please try again later." });
  }
});

app.get("/api/allLogs", async (req, res) => {
  try {
    const allLogs = await prisma.fuel_log.findMany({
      orderBy: { date: "desc" },
    });
    res.status(200).json(allLogs);
  } catch (err) {
    console.error("Unable to retrieve logs in '/api/allLogs': ", err);
    res.status(500).json({ error: err });
  }
});

app.get("/api/gasStations", async (req, res) => {
  try {
    const gasStations = await prisma.fuel_log.findMany({
      distinct: ["gas_station"],
      where: {
        NOT: {
          gas_station: "unknown",
        },
      },
      select: { gas_station: true },
    });
    res.status(200).json(gasStations);
  } catch (err) {
    console.error("Unable to retrieve list of gas stations!");
    res.status(500).json({
      msg: "Unable to retrieve gas stations from db. Please try again later",
      err: err,
    });
  }
});

app.post("/api/log", async (req, res) => {
  const { date, odometer, total_cost, gallons, gas_station, price_per_gallon } = req.body;
  console.log("Received the parameters: ", req.body);
  console.log("Got the gas station: ", gas_station);
  const data = {
    date: new Date(date),
    odometer,
    total_cost,
    gallons,
    gas_station,
    price_per_gallon,
  };
  try {
    await prisma.fuel_log.create({
      data: data,
    });
    res.status(200).json({ msg: "Log succesfully uploaded to database." });
  } catch (err) {
    res.status(500).json({
      err: `Server Error. Please try to upload later... With error: ${err}`,
    });
  }
});

app.delete("/api/logs/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Alright, got log with id: ", id);
  console.log("Attempting to delete it from database...");

  try {
    await prisma.fuel_log.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({ msg: "Successfully deleted log. :)" });
  } catch (err) {
    console.error(
      `Unable to delete record with id: ${id} from database. Please try again later...`,
    );
    console.error(err);
    res.status(500).json({ err: "Server error! Please try to delete later..." });
  }
});

app.patch("/api/logs/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { id: ignoredID, date_display, price, ...rest } = req.body ?? {};
  const data = {
    ...rest,
    ...(date_display ? { date: new Date(date_display) } : {}),
    ...(price ? {total_cost: Number(price)} : {})
  };

  try {
    const updated = await prisma.fuel_log.update({
      where: { id },
      data,
    });
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Unable to udpate record in database for error: ", err);
    res.status(500).json({ error: "Failed to update log in database" });
  }
});

// Catch all /* GET route to route back to react a pplication
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// LISTENER
app.listen(PORT, () => {
  console.log("BACKEND RUNNING ON PORT", PORT);
});
