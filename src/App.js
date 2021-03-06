import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Form, withFormik, Field } from "formik";


function App({ values }) {
  return (
    <Form>
      <Field component="div" name="myRadioGroup">
        <input
          type="radio"
          id="radioOne"
          defaultChecked={values.myRadioGroup === "one"}
          name="myRadioGroup"
          value="one"
        />
        <label htmlFor="radioOne">One</label>

        <input
          type="radio"
          id="radioTwo"
          defaultChecked={values.myRadioGroup === "two"}
          name="myRadioGroup"
          value="two"
        />
        <label htmlFor="radioTwo">Two</label>
      </Field>
      <button type="submit">Submit</button>
    </Form>
  );
}

const FormikApp = withFormik({
  mapPropsToValues({ myRadioGroup }) {
    return {
      myRadioGroup: myRadioGroup || "two"
    };
  },
  handleSubmit(values) {
    console.log(values);
  }
})(App);

export default App;


import React from 'react';
import { render } from 'react-dom';
import { Formik } from 'formik';
import Yup from 'yup';

const withFormik = Formik({
  mapPropsToValues: () => ({ color: '' }),
  validationSchema: Yup.object().shape({
    color: Yup.string().required('Color is required!'),
  }),
  handleSubmit: (values, { setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 1000);
  },
  displayName: 'BasicForm', // helps with React DevTools
});

const MyForm = props => {
  const {
    values,
    touched,
    errors,
    dirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email" style={{ display: 'block' }}>
        Color
      </label>
      <select
        name="color"
        value={values.color}
        onChange={handleChange}
        onBlur={handleBlur}
        style={{ display: 'block' }}
      >
        <option value="" label="Select a color" />
        <option value="red" label="red" />
        <option value="blue" label="blue" />
        <option value="green" label="green" />
      </select>
      {errors.color &&
        touched.color &&
        <div className="input-feedback">
          {errors.color}
        </div>}

      <button
        type="button"
        className="outline"
        onClick={handleReset}
        disabled={!dirty || isSubmitting}
      >
        Reset
      </button>
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>

      <DisplayFormikState {...props} />
    </form>
  );
};

const BasicForm = withFormik(MyForm);

// Helper styles for demo
import './helper.css';
import { MoreResources, DisplayFormikState } from './helper';

const App = () =>
  <div className="app">
    <h1>
      Basic{' '}
      <a
        href="https://github.com/jaredpalmer/formik"
        target="_blank"
        rel="noopener"
      >
        Formik
      </a>{' '}
      Demo
    </h1>

    <BasicForm />
    <MoreResources />
  </div>;

render(<App />, document.getElementById('root'));

