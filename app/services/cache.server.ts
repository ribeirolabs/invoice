import path from "node:path";
import fs from "node:fs";

export async function getCache<T>(key: string): Promise<T | null> {
  const filePath = path.resolve(`.cache/${key}.json`);

  const file = await new Promise<string | null>((resolve) =>
    fs.readFile(filePath, "utf8", (error, data) => {
      if (error) {
        return resolve(null);
      }

      resolve(data);
    })
  );

  if (!file) {
    return null;
  }

  try {
    return JSON.parse(file) satisfies T;
  } catch (e: any) {
    return null;
  }
}

export async function saveCache(key: string, data: any): Promise<void> {
  const filePath = path.resolve(`.cache/${key}.json`);

  return new Promise((resolve) =>
    fs.writeFile(filePath, JSON.stringify(data), () => resolve())
  );
}
