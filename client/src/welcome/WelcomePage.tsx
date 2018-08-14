import './WelcomePage.scss';

import * as React from 'react';

import { Route, RouteComponentProps, Switch } from 'react-router';
import { WithApolloClient, WithApolloClientProps } from '../decorators/WithApolloClient';
import { GetAccessToken, GetAccessTokenVariables } from './__generated__/GetAccessToken';
import { Register, RegisterVariables } from './__generated__/Register';

import { Button } from '@hydrokit/button';
import { FormField } from '@hydrokit/formfield';
import { TextField } from '@hydrokit/textfield';
import { Formik } from 'formik';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { Authenticator } from '../auth/Authenticator';
import { FridgeLocalWithData } from '../fridge/FridgeLocal';
import { FormikSubmitHandler } from '../types/FormikSubmitHandler';

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

const initialEmailPasswordPair: GetAccessTokenVariables = {
  email: '',
  password: ''
};

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

const RegisterMutation = gql`
mutation Register($email: String!, $password: String!) {
  register(email: $email, password: $password)
}
`;

interface WelcomePageProps extends WithApolloClientProps, RouteComponentProps<{}> {}

@WithApolloClient()
export class WelcomePageWithData extends React.PureComponent<WelcomePageProps, {}> {
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

  public render() {
    return (
      <div className="WelcomePage">
        <div className="WelcomePage__AccountPane">
          <h1>Login</h1>
          <Switch>
            <Route path="/signin">
              <EmailPasswordForm onSubmit={this.signIn} buttonLabel="Sign in" />
            </Route>
            <Route path="/signup">
              <EmailPasswordForm onSubmit={this.signUp} buttonLabel="Sign up" />
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
      <span>or</span>
      <Link to="/forgot-password">Forgot password?</Link>
    </div>
  );
}

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

function EmailPasswordForm(props: { onSubmit: FormikSubmitHandler<GetAccessTokenVariables>, buttonLabel: string }) {
  return (
    <Formik initialValues={initialEmailPasswordPair} onSubmit={props.onSubmit} >
      {({ handleSubmit, handleChange, handleBlur, isSubmitting, values, status }) =>
        <form onSubmit={handleSubmit}>
          {status &&
            <p>{status}</p>
          }
          <FormField label="Email">
            <TextField onChange={handleChange} onBlur={handleBlur} value={values.email} name="email" />
          </FormField>
          <FormField label="Password">
            <TextField onChange={handleChange} onBlur={handleBlur} value={values.password} name="password" type="password" />
          </FormField>
          <FormField>
            <Button type="submit" primary disabled={isSubmitting}>{props.buttonLabel}</Button>
          </FormField>
        </form>
      }
    </Formik>
  );
}