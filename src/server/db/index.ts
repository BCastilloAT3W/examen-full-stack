"use server";

import fs from "fs/promises";
import fsSync from "fs";
import { z } from "zod";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "storage");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Ensure storage directory exists
if (!fsSync.existsSync(DATA_DIR)) {
  console.log("Creating data directory");
  fsSync.mkdirSync(DATA_DIR, { recursive: true });
}

// Create initial database file if it doesn't exist
if (!fsSync.existsSync(DB_FILE)) {
  console.log("Creating initial database file");
  fsSync.writeFileSync(DB_FILE, "[]");
}

export type Sensor = {
  id: number;
  name: string;
  description: string;
};

const storageSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
  }),
);

export async function getSensors() {
  let content: Sensor[] = [];
  try {
    content = storageSchema.parse(
      JSON.parse(await fs.readFile(DB_FILE, "utf-8")),
    );
  } catch (e) {
    console.error(e);
  }
  return content;
}

export async function saveNewSensor(sensor: Sensor) {
  const content = await getSensors();
  content.push(sensor);
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(content, null, 2));
  } catch (e) {
    console.error(e);
  }
}

export async function deleteSensor(id: number) {
  const content = await getSensors();
  const newContent = content.filter((sensor) => sensor.id !== id);
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(newContent, null, 2));
  } catch (e) {
    console.error(e);
  }
}
