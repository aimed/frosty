import * as React from 'react';

import { Formik, FormikProps } from 'formik';
import { RouteComponentProps, withRouter } from 'react-router';
import { Register, RegisterVariables } from './__generated__/Register';

import { Button } from '@hydrokit/button';
import { FormField } from '@hydrokit/formfield';
import { TextField } from '@hydrokit/textfield';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { NotificationPosed } from '../notification/Notification';
import { FormikSubmitHandler } from '../types/FormikSubmitHandler';

export const RegisterMutation = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password)
  }
`;

export const initialEmailPasswordPair: RegisterVariables = {
  email: '',
  password: ''
};

export interface SignUpFormProps {
  onSubmit: FormikSubmitHandler<RegisterVariables>;
}

export function SignUpForm(props: SignUpFormProps) {
  return (
    <Formik initialValues={initialEmailPasswordPair} onSubmit={props.onSubmit}>
      {({ handleSubmit, handleChange, handleBlur, isSubmitting, values, status }: FormikProps<RegisterVariables>) => <form onSubmit={handleSubmit}>
        <NotificationPosed type='error'>{status}</NotificationPosed>
        <FormField label="Email">
          <TextField onChange={handleChange} onBlur={handleBlur} value={values.email} name="email" />
        </FormField>
        <FormField label="Password">
          <TextField onChange={handleChange} onBlur={handleBlur} value={values.password} name="password" type="password" />
        </FormField>
        <p>Disclaimer: currently this is only a personal project. Everything might change and all data might get lost at any point.</p>
        <FormField>
          <Button type="submit" primary disabled={isSubmitting}>Agree and Sign up</Button>
        </FormField>
      </form>}
    </Formik>
  );
}

export const SignupFormWithData = withRouter(withApollo<{} & RouteComponentProps<{}>>(props => {
  /**
   * Signs up the given user.
   */
  const signUp: FormikSubmitHandler<RegisterVariables> = async (variables, actions) => {
    try {
      const response = await props.client.mutate<Register, RegisterVariables>({ mutation: RegisterMutation, variables });
      if (response && response.data) {
        props.history.push('/signin');
      }
    } catch (error) {
      console.error(error);
      const gqlError = error as GraphQLError;
      actions.setStatus(gqlError.originalError ? gqlError.originalError.message : gqlError.message);
      actions.setSubmitting(false);
    }
  }
  return <SignUpForm onSubmit={signUp} />;
}));