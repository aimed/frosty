/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ResetPasswordWithToken
// ====================================================

export interface ResetPasswordWithToken {
  /**
   * Resets the users password with the given reset token.
   */
  resetPasswordWithToken: boolean;
}

export interface ResetPasswordWithTokenVariables {
  token: string;
  password: string;
}
