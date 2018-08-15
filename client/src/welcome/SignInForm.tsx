import * as React from 'react';

import { Formik, FormikProps } from 'formik';
import { RouteComponentProps, withRouter } from 'react-router';
import { GetAccessToken, GetAccessTokenVariables } from './__generated__/GetAccessToken';

import { Button } from '@hydrokit/button';
import { FormField } from '@hydrokit/formfield';
import { TextField } from '@hydrokit/textfield';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { Authenticator } from '../auth/Authenticator';
import { FormikSubmitHandler } from '../types/FormikSubmitHandler';

export const inisignSignInVariables: GetAccessTokenVariables = {
  email: '',
  password: ''
};

export interface SignInFormProps {
  onSubmit: FormikSubmitHandler<GetAccessTokenVariables>;
}

export function SignInForm(props: SignInFormProps) {
  return (
    <Formik initialValues={inisignSignInVariables} onSubmit={props.onSubmit}>
      {({ handleSubmit, handleChange, handleBlur, isSubmitting, values, status }: FormikProps<GetAccessTokenVariables>) => <form onSubmit={handleSubmit}>
        {status &&
          <p>{status}</p>}
        <FormField label="Email">
          <TextField onChange={handleChange} onBlur={handleBlur} value={values.email} name="email" />
        </FormField>
        <FormField label="Password">
          <TextField onChange={handleChange} onBlur={handleBlur} value={values.password} name="password" type="password" />
        </FormField>
        <FormField>
          <Button type="submit" primary disabled={isSubmitting}>Sign in</Button>
        </FormField>
      </form>}
    </Formik>
  );
}

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

export const SignInFormWithData = withRouter(withApollo<RouteComponentProps<{}>>(props => {
  /**
   * Signs in the given user.
   */
  const signIn: FormikSubmitHandler<GetAccessTokenVariables> = async (variables, actions) => {
    try {
      const response = await props.client.query<GetAccessToken, GetAccessTokenVariables>({ query: GetAccessTokenQuery, variables });
      if (response.data.accessToken) {
        Authenticator.signIn(response.data.accessToken.token, response.data.accessToken.validUntil);
        props.client.cache.reset().then(
          () => props.history.replace('/')
        );
      }
    } catch (error) {
      const gqlError = error as GraphQLError;
      actions.setFieldValue('password', '');
      actions.setStatus(gqlError.originalError ? gqlError.originalError.message : gqlError.message);
    }
    actions.setSubmitting(false);
  }
  return <SignInForm onSubmit={signIn} />
}));