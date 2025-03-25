import SensorDisplay from "@/components/sensor-display";
import { getSensors } from "@/server/db";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sensor = await getSensors().then((sensors) =>
    sensors.find((sensor) => sensor.id.toString() === id),
  );

  if (!sensor) {
    return <div>Not found</div>;
  }

  return <SensorDisplay sensor={sensor} />;
}
