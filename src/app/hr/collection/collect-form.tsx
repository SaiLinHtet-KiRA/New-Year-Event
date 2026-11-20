"use client";

import { useActionState } from "react";
import { collectAction } from "@/app/actions";
import { Field, SubmitButton } from "@/components/ui";
import type { FormState } from "@/lib/types";

const initialState: FormState = { status: "idle", message: "" };

export default function CollectForm({
  employeeId,
  handedBy,
}: {
  employeeId: string;
  handedBy: string;
}) {
  const [state, action, pending] = useActionState(collectAction, initialState);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="employeeId" value={employeeId} />
      <Field label="Handed by" name="handedBy" defaultValue={handedBy} />
      <SubmitButton pending={pending} className="w-full">
        Confirm prize collected
      </SubmitButton>
      {state.message && (
        <p
          role="status"
          className={`rounded-xl px-3 py-2 text-sm ${
            state.status === "error"
              ? "bg-rose-50 text-rose-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
