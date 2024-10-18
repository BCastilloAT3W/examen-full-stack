"use client";

import { useState } from "react";

export default function DisplayRandomCompanies() {
  const [nCompanies, setNCompanies] = useState(0);
  const [companies, setCompanies] = useState<string[]>([]);

  async function fetchRandomCompanies() {
    setNCompanies(nCompanies + 1);
    const response = await fetch(`/api/get-companies?limit=${nCompanies + 1}`);
    const data = await response.json() as string[];
    setCompanies(data);
  }

  return (
    <div className="h-screen flex flex-col gap-5 p-24">
      <pre className="whitespace-pre-wrap overflow-x-auto bg-gray-100 p-4 rounded-md shadow-inner flex-1">
        {JSON.stringify(companies, null, 0)} {companies.length}
      </pre>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={fetchRandomCompanies}
      >
        Fetch more ({nCompanies})
      </button>
    </div>
  );
}
