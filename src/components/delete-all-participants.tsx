"use client";

import { useActionState, useState } from "react";
import { deleteAllParticipantsAction } from "@/app/actions";
import type { FormState } from "@/lib/types";

const initialState: FormState = { status: "idle", message: "" };

export default function DeleteAllParticipants() {
  const [confirming, setConfirming] = useState(false);
  const [state, action, pending] = useActionState(
    deleteAllParticipantsAction,
    initialState,
  );

  return (
    <div>
      <form action={action}>
        {confirming ? (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <span className="text-xs text-rose-700">
              Delete everyone and reset the draw?
            </span>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              onClick={() => setConfirming(false)}
              className="rounded-lg bg-rose-700 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-800 disabled:opacity-60"
            >
              {pending ? "Deleting…" : "Confirm delete"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
          >
            Delete all participants
          </button>
        )}
      </form>

      {state.message && (
        <p
          role="status"
          className={`mt-2 rounded-lg px-3 py-2 text-xs ${
            state.status === "error"
              ? "bg-rose-50 text-rose-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
