import * as React from 'react';

import { Formik, FormikProps } from 'formik';
import { RequestPasswordReset, RequestPasswordResetVariables } from './__generated__/RequestPasswordReset';

import { Button } from '@hydrokit/button';
import { FormField } from '@hydrokit/formfield';
import { TextField } from '@hydrokit/textfield';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { NotificationPosed } from '../notification/Notification';
import { FormikSubmitHandler } from '../types/FormikSubmitHandler';

export interface ForgotPasswordFormValues {
  email: string;
}

export const initialForgotPasswordFormValues: ForgotPasswordFormValues = {
  email: ''
}

export interface ForgotPasswordFormProps {
  onSubmit: FormikSubmitHandler<ForgotPasswordFormValues>;
}

export function ForgotPasswordForm(props: ForgotPasswordFormProps) {
  return (
    <Formik initialValues={initialForgotPasswordFormValues} onSubmit={props.onSubmit}>
      {
        ({ handleSubmit, handleChange, handleBlur, isSubmitting, values, status }: FormikProps<ForgotPasswordFormValues>) =>
          <form onSubmit={handleSubmit}>
            <NotificationPosed type="success">{status === true && `If we were able to find your email, you can check your inbox now.`}</NotificationPosed>
            <FormField label="Email">
              <TextField onChange={handleChange} onBlur={handleBlur} value={values.email} name="email" />
            </FormField>
            <FormField>
              <Button type="submit" primary disabled={isSubmitting}>Request reset link</Button>
            </FormField>
          </form>
      }
    </Formik>
  );
}

const RequestPasswordResetQuery = gql`
  query RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`;

export const ForgotPasswordFormWithData = withApollo<{}>(props => {
  /**
   * Request a password reset link for the given email.
   */
  const forgotPassword: FormikSubmitHandler<ForgotPasswordFormValues> = async (variables, actions) => {
    try {
      // This always returns true.
      await props.client.query<RequestPasswordReset, RequestPasswordResetVariables>({ variables, query: RequestPasswordResetQuery });
    } catch (error) {
      console.warn(error);
    }
    actions.setSubmitting(false);
    actions.setStatus(true);
  }
  return <ForgotPasswordForm onSubmit={forgotPassword} />
})