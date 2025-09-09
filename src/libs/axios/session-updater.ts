/* eslint-disable @typescript-eslint/no-explicit-any */

import { Session } from "next-auth";

type Updater = (data?: any) => Promise<Session | null>;

let _update: Updater | null = null;

export function setSessionUpdater(fn: Updater) {
  _update = fn;
}

export async function updateSession(data: any) {
  if (!_update) throw new Error("Session updater not initialized");
  return _update(data);
}
