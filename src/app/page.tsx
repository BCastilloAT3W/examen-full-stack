import { SensorForm } from "../components/sensor-form";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Create New Sensor</h1>
      <SensorForm />
    </div>
  );
}
