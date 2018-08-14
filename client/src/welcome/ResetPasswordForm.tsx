import * as React from 'react';

import { Button } from '../../node_modules/@hydrokit/button';
import { FormField } from '../../node_modules/@hydrokit/formfield';
import { TextField } from '../../node_modules/@hydrokit/textfield';
import { Formik } from '../../node_modules/formik';
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
      {({ handleSubmit, handleChange, handleBlur, isSubmitting, values, status }) => <form onSubmit={handleSubmit}>
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
