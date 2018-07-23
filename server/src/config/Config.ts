export class Config {
  public static get(key: string, fallback?: string): string {
    if (process.env[key]) {
      return process.env[key] as string;
    }

    if (fallback !== undefined) {
      return fallback;
    }

    throw new Error(`Environment variable ${key} not set, but required.`);
  }
}
