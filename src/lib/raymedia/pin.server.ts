import { readFile } from "node:fs/promises";
import { env } from "@/lib/env.server";

export async function expectedPin(): Promise<string | undefined> {
  const fromEnv = env("ADMIN_PIN");
  if (fromEnv) return fromEnv;
  if (env("VERCEL")) return undefined;
  try {
    const text = await readFile("/workspace/.grok/admin-pin", "utf8");
    const pin = text.trim();
    return pin || undefined;
  } catch {
    return undefined;
  }
}
