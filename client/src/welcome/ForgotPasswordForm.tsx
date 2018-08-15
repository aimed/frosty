import * as React from 'react';

import { Formik, FormikProps } from 'formik';

import { Button } from '@hydrokit/button';
import { FormField } from '@hydrokit/formfield';
import { TextField } from '@hydrokit/textfield';
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
            {status === true &&
              <p>If we were able to find your email, you can check your inbox now.</p>}
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
