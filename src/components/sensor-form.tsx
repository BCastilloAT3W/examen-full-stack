"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { saveNewSensor } from "@/server/db";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/utils";

const sensorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

type SensorFormValues = z.infer<typeof sensorSchema>;

export function SensorForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    } as SensorFormValues,
    onSubmit: async ({ value }) => {
      const newSensor = {
        id: Date.now(), // Simple way to generate unique IDs
        ...value,
      };
      await saveNewSensor(newSensor);
      // Reset form after successful submission
      form.reset();
    },
    validators: {
      onSubmit: sensorSchema,
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="w-full max-w-md space-y-4"
    >
      <div className="space-y-2">
        <form.Field name="name">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={field.state.meta.errors.length ? true : undefined}
              />
              {field.state.meta.errors.length ? (
                <em className="text-sm text-destructive">
                  {field.state.meta.errors.reduce((acc, error) => {
                    if (acc === "") return getErrorMessage(error);
                    return `${acc}, ${getErrorMessage(error)}`;
                  }, "")}
                </em>
              ) : null}
            </div>
          )}
        </form.Field>
      </div>

      <div className="space-y-2">
        <form.Field name="description">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={3}
                aria-invalid={field.state.meta.errors.length ? true : undefined}
              />
              {field.state.meta.errors.length ? (
                <em className="text-sm text-destructive">
                  {field.state.meta.errors.reduce((acc, error) => {
                    if (acc === "") return getErrorMessage(error);
                    return `${acc}, ${getErrorMessage(error)}`;
                  }, "")}
                </em>
              ) : null}
            </div>
          )}
        </form.Field>
      </div>

      <Button type="submit" className="w-full">
        Create Sensor
      </Button>
    </form>
  );
}
