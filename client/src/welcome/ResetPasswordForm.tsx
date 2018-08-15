import * as React from 'react';

import { Formik, FormikProps } from 'formik';

import { Button } from '@hydrokit/button';
import { FormField } from '@hydrokit/formfield';
import { TextField } from '@hydrokit/textfield';
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
