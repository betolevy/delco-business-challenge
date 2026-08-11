const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

export const kvConfigured = Boolean(KV_URL && KV_TOKEN);

type Command = (string | number)[];

/**
 * Thin wrapper around the Upstash Redis REST pipeline endpoint.
 * No SDK dependency — just fetch, so it works from any runtime.
 */
async function pipeline(commands: Command[]): Promise<unknown[]> {
  if (!KV_URL || !KV_TOKEN) {
    throw new Error("KV is not configured (missing KV_REST_API_URL/KV_REST_API_TOKEN)");
  }
  const res = await fetch(`${KV_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`KV pipeline failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { result: unknown; error?: string }[];
  return data.map((r) => {
    if (r.error) throw new Error(`KV command failed: ${r.error}`);
    return r.result;
  });
}

export async function kvGet(key: string): Promise<string | null> {
  const [result] = await pipeline([["GET", key]]);
  return (result as string | null) ?? null;
}

export async function kvSet(key: string, value: string): Promise<void> {
  await pipeline([["SET", key, value]]);
}

export async function kvSadd(key: string, member: string): Promise<void> {
  await pipeline([["SADD", key, member]]);
}

export async function kvSmembers(key: string): Promise<string[]> {
  const [result] = await pipeline([["SMEMBERS", key]]);
  return (result as string[]) ?? [];
}

export async function kvZadd(key: string, score: number, member: string): Promise<void> {
  await pipeline([["ZADD", key, score, member]]);
}

export async function kvZrevrange(key: string, start: number, stop: number): Promise<string[]> {
  const [result] = await pipeline([["ZREVRANGE", key, start, stop]]);
  return (result as string[]) ?? [];
}

export async function kvMget(keys: string[]): Promise<(string | null)[]> {
  if (keys.length === 0) return [];
  const [result] = await pipeline([["MGET", ...keys]]);
  return (result as (string | null)[]) ?? [];
}

export async function kvDel(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  await pipeline([["DEL", ...keys]]);
}

export async function kvSrem(key: string, member: string): Promise<void> {
  await pipeline([["SREM", key, member]]);
}

export async function kvZrem(key: string, member: string): Promise<void> {
  await pipeline([["ZREM", key, member]]);
}
