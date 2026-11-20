"use server";

import { revalidatePath } from "next/cache";
import {
  addPrize,
  checkResult,
  markCollected,
  publishWinners,
  registerParticipant,
  runDraw,
} from "@/lib/data";
import type { FormState, ResultState } from "@/lib/types";

function refresh() {
  revalidatePath("/", "layout");
}

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function registerAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    await registerParticipant({
      employeeId: field(formData, "employeeId"),
      fullName: field(formData, "fullName"),
      department: field(formData, "department"),
    });
    refresh();
    return {
      status: "success",
      message: "Registration complete. You are included in the draw.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Registration failed.",
    };
  }
}

export async function addPrizeAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = field(formData, "name").trim();
  try {
    await addPrize(name, Number(field(formData, "count")));
    refresh();
    return {
      status: "success",
      message: `Prize "${name}" added to the draw.`,
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Could not add the prize.",
    };
  }
}

export async function checkResultAction(
  _previous: ResultState,
  formData: FormData,
): Promise<ResultState> {
  try {
    return await checkResult(field(formData, "employeeId"));
  } catch {
    return { status: "error", message: "Could not check the result right now." };
  }
}

export async function runDrawAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  void formData;
  try {
    const count = await runDraw();
    refresh();
    return {
      status: "success",
      message: `Draw complete. ${count} winner${count === 1 ? "" : "s"} selected.`,
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Could not run the draw.",
    };
  }
}

export async function publishAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  void formData;
  try {
    await publishWinners();
    refresh();
    return {
      status: "success",
      message: "Winner list published. Employees can now check their result.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Could not publish winners.",
    };
  }
}

export async function collectAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    await markCollected(
      field(formData, "employeeId"),
      field(formData, "handedBy"),
    );
    refresh();
    return { status: "success", message: "Prize collection recorded." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Could not record collection.",
    };
  }
}
