import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import EmailTanstackService from '../../../services/email/EmailTanstackService';

const FormComponent = () => {
  const { t } = useTranslation('global');
  const [fileName, setFileName] = useState<string | null>(null);

  const initialValues = {
    email: '',
    subject: '',
    body: '',
    attachment: null,
    isAgreed: false,
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('validation.invalid_email'))
      .required(t('validation.required')),
    subject: Yup.string()
      .required(t('validation.required')),
    body: Yup.string()
      .required(t('validation.required')),
    isAgreed: Yup.boolean()
      .oneOf([true], t('validation.must_accept_terms'))
      .required(t('validation.required')),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
    try {
      await EmailTanstackService.sendEmail(
        values.email,
        values.subject,
        values.body,
        values.attachment
      );
      alert(t('contact.email_sent'));
      resetForm(); 
      setFileName(null);
    } catch (error) {
      alert(t('contact.email_failed'));
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, isSubmitting, values }) => (
        <Form>
          <div>
            <ErrorMessage name="email" component="div" className="error" />
            <Field
              type="email"
              name="email"
              placeholder={t('contact.email')}
              className="form-field"
              required
            />
          </div>

          <div>
            <ErrorMessage name="subject" component="div" className="error" />
            <Field
              type="text"
              name="subject"
              placeholder={t('contact.subject')}
              className="form-field"
              required
            />
          </div>

          <div>
            <Field
              as="textarea"
              name="body"
              required
            />
            <ErrorMessage name="body" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="attachment" className="custom-file-upload">
              {t('contact.choose_file')}
            </label>
            <input
              id="attachment"
              type="file"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files[0]) {
                  setFieldValue('attachment', e.target.files[0]);
                  setFileName(e.target.files[0].name);
                }
              }}
              accept=".pdf,.doc,.docx,.jpg,.png"
              style={{ display: 'none' }}
            />
            {fileName && <div className="file-name">{fileName}</div>}
          </div>

          <div>
            <ErrorMessage name="isAgreed" component="div" className="error" />
            <Field
              type="checkbox"
              name="isAgreed"
            />
            <label htmlFor="isAgreed"></label>
            <span className="consent">
              {t('contact.agreement')}
            </span>
          </div>

          <button type="submit" disabled={isSubmitting || !values.isAgreed} className='field'>
            {t('buttons.send_message')}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default FormComponent;
