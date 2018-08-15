/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAccessToken
// ====================================================

export interface GetAccessToken_accessToken_user {
  id: string;
  email: string;
}

export interface GetAccessToken_accessToken {
  token: string;
  /**
   * Date until the token is valid in UTC ms.
   */
  validUntil: number;
  user: GetAccessToken_accessToken_user;
}

export interface GetAccessToken {
  /**
   * 
   *         Get an access token for a email password pair.
   *       
   */
  accessToken: GetAccessToken_accessToken;
}

export interface GetAccessTokenVariables {
  email: string;
  password: string;
}
