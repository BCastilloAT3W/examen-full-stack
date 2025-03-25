import { z } from "zod";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { faker } from '@faker-js/faker';

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const schema = z.object({
  limit: z.string().transform((val) => parseInt(val, 10)),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limitParam = url.searchParams.get("limit");
  const { limit } = schema.parse({ limit: limitParam });

  const timeToWait = Math.floor(Math.random() * 2000);
  await wait(timeToWait);

  return NextResponse.json(getCompanies(limit));
}

function getCompanies(nCompanies: number) {
  faker.seed(123);

  return Array.from({ length: nCompanies }, () => faker.company.name());
}
