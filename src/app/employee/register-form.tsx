"use client";

import { useActionState } from "react";
import { registerAction } from "@/app/actions";
import { Field, SubmitButton } from "@/components/ui";
import type { FormState } from "@/lib/types";

const initialState: FormState = { status: "idle", message: "" };

export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initialState);

  return (
    <form action={action} className="space-y-4">
      <Field
        label="Employee ID"
        name="employeeId"
        placeholder="e.g. EMP-1001"
      />
      <Field label="Full name" name="fullName" placeholder="e.g. Alex Morgan" />
      <Field label="Department" name="department" placeholder="e.g. Finance" />
      <SubmitButton pending={pending} className="w-full">
        Register for prize draw
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
