"use client";

import { deleteSensor, Sensor } from "@/server/db";
import { Cpu } from "lucide-react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export default function SensorDisplay({ sensor }: { sensor: Sensor }) {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-8">
      <Cpu size={64} className="mb-2" />
      <h1 className="text-4xl font-bold">{sensor.name}</h1>
      <p>{sensor.description}</p>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>Delete sensor</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              sensor {`"${sensor.name}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteSensor(sensor.id);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
