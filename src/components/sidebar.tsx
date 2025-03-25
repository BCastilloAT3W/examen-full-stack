import { getSensors } from "@/server/db";
import Link from "next/link";
import { Cpu, Home } from "lucide-react";

export default async function Sidebar() {
  const sensors = await getSensors();

  return (
    <div className="h-screen w-[350px] bg-secondary border-r p-6 flex flex-col">
      <Link
        href="/"
        className="flex justify-left items-center gap-4 border rounded p-2 pl-4 bg-background/40 hover:bg-background/80"
      >
        <Home size={18} />
        <span>Inicio</span>
      </Link>

      <h2 className="text-secondary-foreground mt-8">Sensores</h2>

      <ul className="my-3 flex flex-col gap-3">
        {sensors.map((sensor) => (
          <Link
            key={sensor.id}
            href={`/sensor/${sensor.id}`}
            className="flex justify-left items-center gap-4 border rounded p-2 pl-4 bg-background/40 hover:bg-background/80"
          >
            <Cpu size={18} />
            <span>{sensor.name}</span>
          </Link>
        ))}
      </ul>
    </div>
  );
}
