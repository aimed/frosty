export class Config {
  /**
   * Gets the given key frmo the runtime environment. If no fallback is given and the key is
   * undefined, an Error will be thrown.
   * @param key The environment variable to read.
   * @param fallback The default value.
   */
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
