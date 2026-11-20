"use client";

import { useActionState, useState } from "react";
import { addPrizeAction } from "@/app/actions";
import { Card, Field, SubmitButton } from "@/components/ui";
import type { FormState, PrizeConfig } from "@/lib/types";

const initialState: FormState = { status: "idle", message: "" };

export default function AddPrize({ prizes }: { prizes: PrizeConfig[] }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(addPrizeAction, initialState);

  return (
    <Card
      title="Draw prizes"
      description="Prizes available for the next draw"
      action={
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-800"
        >
          {open ? "Cancel" : "Add prize"}
        </button>
      }
    >
      <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto pr-1">
        {prizes.map((prize) => (
          <span
            key={prize.name}
            className="h-fit rounded-full bg-stone-100 px-3 py-1.5 text-sm text-stone-700"
          >
            {prize.name} <span className="text-stone-500">×{prize.count}</span>
          </span>
        ))}
      </div>

      <form
        action={action}
        className={open ? "mt-5 flex flex-wrap items-end gap-3" : "hidden"}
      >
        <label className="min-w-[220px] flex-1">
            <span className="mb-1.5 block text-sm font-medium text-stone-700">
              Prize name
            </span>
            <input
              name="name"
              required
              placeholder="e.g. Lucky Draw Prize"
              className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
            />
          </label>
          <Field label="Number of prizes" name="count" type="number" defaultValue="1" />
        <SubmitButton pending={pending}>Create prize</SubmitButton>
      </form>

      {state.message && (
        <p
          role="status"
          className={`mt-4 rounded-xl px-3 py-2 text-sm ${
            state.status === "error"
              ? "bg-rose-50 text-rose-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {state.message}
        </p>
      )}
    </Card>
  );
}
