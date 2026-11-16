// SendInvitationForm.tsx
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { NewInvitation } from '../../../types/types';
import Service from '../../../services/invitations/';

interface SendInvitationFormProps {
    onSuccess: () => void;
    initialEmail: string;
}

const SendInvitationForm: React.FC<SendInvitationFormProps> = ({ onSuccess, initialEmail }) => {
    const { t } = useTranslation('global');
    const [invitationSent, setInvitationSent] = useState(false);

    const postInvitation = (values: { email: string }) => {
        const newInvitation: NewInvitation = { email: values.email };
        Service.postNewInvitation(newInvitation)
            .then(() => {
                setInvitationSent(true);
                onSuccess();
            })
            .catch(error => {
                console.error('Błąd podczas wysyłania zaproszenia:', error);
            });
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{ email: initialEmail }}
            validationSchema={Yup.object({
                email: Yup.string()
                    .email(t("validation.invalid_email"))
                    .required(t("validation.this_field_is_required"))
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                postInvitation(values);
                setSubmitting(false);
                resetForm();
            }}
        >
            {formik => (
                <Form>
                    <Field
                        name="email"
                        type="email"
                        placeholder={t("buttons.placeholder_send_invitation")}
                        className="form-field"
                    />
                    <ErrorMessage name="email" component="div" />
                    <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="width_15rem"
                    >
                        {t("buttons.send_invitation")}
                    </button>
                    {invitationSent && <div style={{ color: 'green' }}>{t('invitations.sent')}</div>}
                </Form>
            )}
        </Formik>
    );
};

export default SendInvitationForm;
