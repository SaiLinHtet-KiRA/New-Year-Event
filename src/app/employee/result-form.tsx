"use client";

import { useActionState } from "react";
import { checkResultAction } from "@/app/actions";
import { Field, SubmitButton } from "@/components/ui";
import type { ResultState } from "@/lib/types";

const initialState: ResultState = { status: "idle" };

export default function ResultForm() {
  const [state, action, pending] = useActionState(checkResultAction, initialState);

  return (
    <div className="space-y-4">
      <form action={action} className="space-y-4">
        <Field label="Employee ID" name="employeeId" placeholder="e.g. EMP-1001" />
        <SubmitButton pending={pending} className="w-full">
          Check result
        </SubmitButton>
      </form>

      {state.status === "won" && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-900">
            Congratulations, {state.employeeName}, you won!
          </p>
          <p className="mt-2 text-sm text-emerald-800">
            Prize: <span className="font-semibold">{state.prize}</span>
          </p>
          <p className="mt-1 text-sm text-emerald-800">
            Status:{" "}
            {state.collected
              ? "Prize collected"
              : "Won, awaiting collection"}
          </p>
          {!state.collected && (
            <p className="mt-2 text-xs text-emerald-700">
              Please collect it from HR.
            </p>
          )}
        </div>
      )}

      {(state.status === "not-selected" ||
        state.status === "not-registered" ||
        state.status === "not-published" ||
        state.status === "error") && (
        <p
          role="status"
          className={`rounded-xl px-3 py-2 text-sm ${
            state.status === "not-selected"
              ? "bg-stone-100 text-stone-700"
              : "bg-amber-50 text-amber-800"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
