import * as React from 'react';

import { Formik, FormikProps } from 'formik';
import { RouteComponentProps, withRouter } from 'react-router';
import { ResetPasswordWithToken, ResetPasswordWithTokenVariables } from './__generated__/ResetPasswordWithToken';

import { Button } from '@hydrokit/button';
import { FormField } from '@hydrokit/formfield';
import { TextField } from '@hydrokit/textfield';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { FormikSubmitHandler } from '../types/FormikSubmitHandler';

export interface ResetPasswordFormValues {
  password: string;
}

export const initialResetPasswordFormValues: ResetPasswordFormValues = {
  password: ''
}

export interface ResetPasswordFormProps {
  onSubmit: FormikSubmitHandler<ResetPasswordFormValues>;
}

export function ResetPasswordForm(props: ResetPasswordFormProps) {
  return (
    <Formik initialValues={initialResetPasswordFormValues} onSubmit={props.onSubmit}>
      {({ handleSubmit, handleChange, handleBlur, isSubmitting, values, status }: FormikProps<ResetPasswordFormValues>) => <form onSubmit={handleSubmit}>
        {status &&
          <p>{status}</p>}
        <FormField label="Password">
          <TextField onChange={handleChange} onBlur={handleBlur} value={values.password} name="password" type="password" />
        </FormField>
        <FormField>
          <Button type="submit" primary disabled={isSubmitting}>Reset</Button>
        </FormField>
      </form>}
    </Formik>
  );
}

const ResetPasswordWithTokenQuery = gql`
query ResetPasswordWithToken($token: String!, $password: String!) {
  resetPasswordWithToken(token: $token, password: $password)
}
`;

export const ResetPasswordFormWithData = withRouter(withApollo<RouteComponentProps<{}>>(props => {
  const resetPassword: FormikSubmitHandler<ResetPasswordFormValues> = async (variables, actions) => {
    try {
      const search = props.location.search;
      const params = new URLSearchParams(search);
      const token  = params.get('token');
      if (token) {
        await props.client.query<ResetPasswordWithToken, ResetPasswordWithTokenVariables>({ variables: { ...variables, token }, query: ResetPasswordWithTokenQuery });
        props.history.push('/');
      }
    } catch (error) {
      console.warn(error);
      actions.setStatus(error.message);
      actions.setSubmitting(false);
    }
  }
  return <ResetPasswordForm onSubmit={resetPassword} />;
}));