export class Authenticator {
  public static readonly LocalStorageKeyToken = 'token';
  public static readonly LocalStorageKeyValidUntil = 'token_validUntil';

  public static get isAuthenticated(): boolean {
    return !!window.localStorage.getItem(Authenticator.LocalStorageKeyToken);
  }

  public static signIn(token: string, validUntil: number): void {
    window.localStorage.setItem(Authenticator.LocalStorageKeyToken, token);
    window.localStorage.setItem(Authenticator.LocalStorageKeyValidUntil, validUntil.toString());
  }

  public static signOut(): void {
    window.localStorage.removeItem(Authenticator.LocalStorageKeyToken);
    window.localStorage.removeItem(Authenticator.LocalStorageKeyValidUntil);
  }
}