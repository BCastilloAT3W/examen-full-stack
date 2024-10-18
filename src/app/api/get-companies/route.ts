import { db } from "@/server/db";
import { z } from "zod";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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

  const response = await db.query.company.findMany({
    columns: {
      name: true,
    },
    orderBy: (table, { desc }) => desc(table.companyId),
    limit: limit,
  });

  return NextResponse.json(response.map((company) => company.name));
}
