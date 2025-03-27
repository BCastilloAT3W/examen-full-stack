import { z } from "zod";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { faker } from "@faker-js/faker";

const ERROR_RATE = 0.0;

const schema = z.object({
  limit: z.string().transform((val) => parseInt(val, 10)),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limitParam = url.searchParams.get("limit");
  const { limit } = schema.parse({ limit: limitParam });

  const timeToWait = Math.floor(Math.random() * 4000);
  await wait(timeToWait);

  const randomNumber = Math.random();
  if (randomNumber < ERROR_RATE) {
    const errorMessage = `Failed to fetch companies, error code ${Math.floor(randomNumber * 1000)}`;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }

  return NextResponse.json(getCompanies(limit));
}

function getCompanies(nCompanies: number) {
  faker.seed(123);

  return Array.from({ length: nCompanies }, () => faker.company.name());
}

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
