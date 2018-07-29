

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
   *         Get an access token for a email password pair. If null is returned the
   *         authentication failed.
   *       
   */
  accessToken: GetAccessToken_accessToken | null;
}

export interface GetAccessTokenVariables {
  email: string;
  password: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================