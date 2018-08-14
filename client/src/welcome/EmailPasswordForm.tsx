import * as React from 'react';

import { Button } from '@hydrokit/button';
import { FormField } from '@hydrokit/formfield';
import { TextField } from '@hydrokit/textfield';
import { Formik } from 'formik';
import { FormikSubmitHandler } from '../types/FormikSubmitHandler';
import { GetAccessTokenVariables } from './__generated__/GetAccessToken';

export const initialEmailPasswordPair: GetAccessTokenVariables = {
  email: '',
  password: ''
};

export interface EmailPasswordFormProps {
  onSubmit: FormikSubmitHandler<GetAccessTokenVariables>;
  buttonLabel: string;
}

export function EmailPasswordForm(props: EmailPasswordFormProps) {
  return (
    <Formik initialValues={initialEmailPasswordPair} onSubmit={props.onSubmit}>
      {({ handleSubmit, handleChange, handleBlur, isSubmitting, values, status }) => <form onSubmit={handleSubmit}>
        {status &&
          <p>{status}</p>}
        <FormField label="Email">
          <TextField onChange={handleChange} onBlur={handleBlur} value={values.email} name="email" />
        </FormField>
        <FormField label="Password">
          <TextField onChange={handleChange} onBlur={handleBlur} value={values.password} name="password" type="password" />
        </FormField>
        <FormField>
          <Button type="submit" primary disabled={isSubmitting}>{props.buttonLabel}</Button>
        </FormField>
      </form>}
    </Formik>
  );
}