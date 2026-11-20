"use client";

import { useActionState } from "react";
import { publishAction, runDrawAction } from "@/app/actions";
import DeleteAllParticipants from "@/components/delete-all-participants";
import { SubmitButton } from "@/components/ui";
import type { FormState } from "@/lib/types";

const initialState: FormState = { status: "idle", message: "" };

export default function DrawControls({
  hasDraw,
  published,
}: {
  hasDraw: boolean;
  published: boolean;
}) {
  const [drawState, drawAction, drawPending] = useActionState(
    runDrawAction,
    initialState,
  );
  const [publishState, publishActionFn, publishPending] = useActionState(
    publishAction,
    initialState,
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <form action={drawAction}>
          <SubmitButton pending={drawPending}>
            {hasDraw ? "Re-run draw" : "Run draw"}
          </SubmitButton>
        </form>
        <form action={publishActionFn}>
          <SubmitButton pending={publishPending} className="bg-stone-800 hover:bg-stone-900">
            {published ? "Re-publish winners" : "Publish winners"}
          </SubmitButton>
        </form>
      </div>

      {[drawState, publishState].map((state, index) =>
        state.message ? (
          <p
            key={index}
            role="status"
            className={`rounded-xl px-3 py-2 text-sm ${
              state.status === "error"
                ? "bg-rose-50 text-rose-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {state.message}
          </p>
        ) : null,
      )}

      <div className="border-t border-stone-100 pt-4">
        <DeleteAllParticipants />
      </div>
    </div>
  );
}
