import { FormikActions } from 'formik';

export type FormikSubmitHandler<T> = (values:T, actions: FormikActions<T>) => void;