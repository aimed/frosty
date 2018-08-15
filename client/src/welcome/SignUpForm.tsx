import * as React from 'react';

import { Button } from '@hydrokit/button';
import { FormField } from '@hydrokit/formfield';
import { TextField } from '@hydrokit/textfield';
import { Formik } from 'formik';
import { FormikSubmitHandler } from '../types/FormikSubmitHandler';
import { RegisterVariables } from './__generated__/Register';

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
      {({ handleSubmit, handleChange, handleBlur, isSubmitting, values, status }) => <form onSubmit={handleSubmit}>
        {status &&
          <p>{status}</p>}
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