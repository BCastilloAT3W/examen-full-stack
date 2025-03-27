"use client";

import { useState } from "react";
import { z } from "zod";

export default function DisplayRandomCompanies() {
  const [nCompanies, setNCompanies] = useState(0);
  const [companies, setCompanies] = useState<string[]>([]);

  async function fetchCompanies() {
    setNCompanies(nCompanies + 1);
    const response = await fetch(`/api/get-companies?limit=${nCompanies + 1}`);
    const companies = z.array(z.string()).parse(await response.json());
    setCompanies(companies);
  }

  return (
    <div className="h-screen flex flex-col gap-5 p-24">
      <pre className="whitespace-pre-wrap overflow-x-auto p-4 rounded-md flex-1 border">
        {JSON.stringify(companies, null, 0)} {companies.length}
      </pre>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={fetchCompanies}
      >
        Fetch more ({nCompanies})
      </button>
    </div>
  );
}
