import './WelcomePage.scss';

import * as React from 'react';

import { withApollo, WithApolloClient } from 'react-apollo';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { GetAccessToken, GetAccessTokenVariables } from './__generated__/GetAccessToken';
import { Register, RegisterVariables } from './__generated__/Register';
import { RequestPasswordReset, RequestPasswordResetVariables } from './__generated__/RequestPasswordReset';
import { ResetPasswordWithToken, ResetPasswordWithTokenVariables } from './__generated__/ResetPasswordWithToken';
import { ForgotPasswordForm, ForgotPasswordFormValues } from './ForgotPasswordForm';
import { ResetPasswordForm, ResetPasswordFormValues } from './ResetPasswordForm';

import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { Authenticator } from '../auth/Authenticator';
import { FridgeLocalWithData } from '../fridge/FridgeLocal';
import { FormikSubmitHandler } from '../types/FormikSubmitHandler';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

/*
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                                                                              │
│                                                                              │
│                                                                              │
│                                    Frosty                                    │
│                              What' in my fridge?                             │
│                                                                              │
│                                 ┌─────────┐                                  │
│                                 │Email    │                                  │
│                                 ├─────────┤                                  │
│                                 │Password │                                  │
│                                 └─────────┘                                  │
│                                 ┌─────────┐                                  │
│                                 │ Sign In │                                  │
│                                 └─────────┘                                  │
│                                                                              │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
*/

const GetAccessTokenQuery = gql`
query GetAccessToken($email: String!, $password: String!) {
  accessToken(email: $email, password: $password) {
    token
    validUntil
    user {
      id
      email
    }
  }
}
`;

const RequestPasswordResetQuery = gql`
query RequestPasswordReset($email: String!) {
  requestPasswordReset(email: $email)
}
`;

const ResetPasswordWithTokenQuery = gql`
query ResetPasswordWithToken($token: String!, $password: String!) {
  resetPasswordWithToken(token: $token, password: $password)
}
`

const RegisterMutation = gql`
mutation Register($email: String!, $password: String!) {
  register(email: $email, password: $password)
}
`;

interface WelcomePageProps extends WithApolloClient<{}>, RouteComponentProps<{}> { }

export class WelcomePage extends React.PureComponent<WelcomePageProps, {}> {
  /**
   * Signs in the given user.
   */
  public signIn: FormikSubmitHandler<GetAccessTokenVariables> = async (variables, actions) => {
    try {
      const response = await this.props.client.query<GetAccessToken, GetAccessTokenVariables>({ query: GetAccessTokenQuery, variables });
      if (response.data.accessToken) {
        Authenticator.signIn(response.data.accessToken.token, response.data.accessToken.validUntil);
        this.props.client.cache.reset().then(
          () => this.props.history.replace('/')
        );
      }
    } catch (error) {
      const gqlError = error as GraphQLError;
      actions.setFieldValue('password', '');
      actions.setStatus(gqlError.originalError ? gqlError.originalError.message : gqlError.message);
    }
    actions.setSubmitting(false);
  }

  /**
   * Signs up the given user.
   */
  public signUp: FormikSubmitHandler<RegisterVariables> = async (variables, actions) => {
    try {
      const response = await this.props.client.mutate<Register, RegisterVariables>({ mutation: RegisterMutation, variables });
      if (response && response.data) {
        this.signIn(variables, actions);
      }
    } catch (error) {
      console.error(error);
      const gqlError = error as GraphQLError;
      actions.setFieldValue('email', '');
      actions.setFieldValue('password', '');
      actions.setStatus(gqlError.originalError ? gqlError.originalError.message : gqlError.message);
      actions.setSubmitting(false);
    }
  }

  /**
   * Request a password reset link for the given email.
   */
  public forgotPassword: FormikSubmitHandler<ForgotPasswordFormValues> = async (variables, actions) => {
    try {
      // This always returns true.
      await this.props.client.query<RequestPasswordReset, RequestPasswordResetVariables>({ variables, query: RequestPasswordResetQuery });
    } catch (error) {
      console.warn(error);
    }
    actions.setSubmitting(false);
    actions.setStatus(true);
  }

  public resetPassword: FormikSubmitHandler<ResetPasswordFormValues> = async (variables, actions) => {
    try {
      const search = this.props.location.search;
      const params = new URLSearchParams(search);
      const token  = params.get('token');
      if (token) {
        await this.props.client.query<ResetPasswordWithToken, ResetPasswordWithTokenVariables>({ variables: { ...variables, token }, query: ResetPasswordWithTokenQuery });
        this.props.history.push('/');
      }
    } catch (error) {
      console.warn(error);
      actions.setStatus(error.message);
      actions.setSubmitting(false);
    }
  }

  public render() {
    return (
      <div className="WelcomePage">
        <div className="WelcomePage__AccountPane">
          <Switch>
            <Route path="/signin">
              <>
                <h1>Sign in</h1>
                <SignInForm onSubmit={this.signIn} />
              </>
            </Route>
            <Route path="/signup">
              <>
                <h1>Sign up</h1>
                <SignUpForm onSubmit={this.signUp} />
              </>
            </Route>
            <Route path="/forgot-password">
              <>
                <h1>Request password reset link</h1>
                <ForgotPasswordForm onSubmit={this.forgotPassword} />
              </>
            </Route>
            <Route path="/reset-password">
              <>
                <h1>Reset password</h1>
                <ResetPasswordForm onSubmit={this.resetPassword} />
              </>
            </Route>
          </Switch>
          <Footer />
        </div>
        <div className="WelcomePage__Fridge">
          <FridgeLocalWithData />
        </div>
      </div>
    );
  }
}

function Footer() {
  return (
    <div className="WelcomePage__Footer">
      <Link to="/signup">No account?</Link>
      <span>|</span>      
      <Link to="/signin">Sign in?</Link>
      <span>|</span>
      <Link to="/forgot-password">Forgot password?</Link>
    </div>
  );
}

export const WelcomePageWithData = withApollo(WelcomePage);

// function FridgePicture() {
//   return (
//     <picture>
//           <img
//             sizes="(max-width: 1400px) 80vw, 1400px"
//             srcSet="
//               fridge/fridge_qq88zm_c_scale_w_1400_sbtf4d_c_scale,w_200.png 200w,
//               fridge/fridge_qq88zm_c_scale_w_1400_sbtf4d_c_scale,w_775.png 775w,
//               fridge/fridge_qq88zm_c_scale_w_1400_sbtf4d_c_scale,w_1136.png 1136w,
//               fridge/fridge_qq88zm_c_scale_w_1400_sbtf4d_c_scale,w_1400.png 1400w"
//             src="fridge/fridge_qq88zm_c_scale_w_1400_sbtf4d_c_scale,w_1400.png"
//             alt="Fridge" />
//         </picture>
//   );
// }
