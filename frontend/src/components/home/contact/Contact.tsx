import React from 'react';
import { useTranslation } from 'react-i18next';
import FormComponent from './FormComponent';

function formatNewlines(text: any) {
  return text.split('\n').map((str: any, index: any) => (
    <React.Fragment key={index}>
      {str}
      <br />
    </React.Fragment>
  ));
}

export default function Contact() {
  const { t } = useTranslation('global');

  return (
    <div>
      <p className="consent">
        {formatNewlines(t('contact.content'))}
      </p>
      <FormComponent />
    </div>
  );
}
