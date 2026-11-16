import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Client, NewDictBodyTest } from '../../../../../types/types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DictBodyTestService from '../../../../../services/dict/DictBodyTestService';
import { LANGUAGES } from '../../../../../translations/Languages';
import Modal from '../../../../../constants/Modal';

interface ClientDetailsProps {
    client: Client;
    onClose?: () => void;
}

const AddNewBodyTest: React.FC<ClientDetailsProps> = ({ client, onClose }) => {
    const { t } = useTranslation('global');
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const validationSchema = Yup.object({
        name: Yup.string().required(t('validation.this_field_is_required')),
        description: Yup.string().required(t('validation.this_field_is_required')),
        purpose: Yup.string().required(t('validation.this_field_is_required')),
    });

    const initialValues = {
        id: crypto.randomUUID(),
        name: '',
        description: '',
        purpose: '',
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        onClose?.();
    };

    const handleSubmit = (values: { name: string, description: string, purpose: string }) => {
        const requestBody: NewDictBodyTest = {
            id: crypto.randomUUID(),
            name: { [selectedLanguage]: values.name },
            description: { [selectedLanguage]: values.description },
            purpose: { [selectedLanguage]: values.purpose },
        };
        DictBodyTestService.postDictBodyTest(requestBody)
            .then(response => {
                console.log('Server response:', response);
            })
            .catch(error => {
                console.error('Error sending request:', error);
            });
        handleCloseModal();
    };

    return (
        <div>
            <button onClick={() => setIsModalOpen(true)}>{t('buttons.create_new_test')}</button>

            <Modal show={isModalOpen} onClose={handleCloseModal} title={t('buttons.create_new_test')}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {formik => (
                        <Form>
                            <div>
                                <select
                                    id="language"
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    style={{ width: '100%', padding: '0.5em', borderRadius: '6px' }}
                                >
                                    {LANGUAGES.map(lang => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <div>
                                    <Field name="name" type="text" style={{ width: '100%', padding: '0.5em', borderRadius: '6px' }} placeholder={t('dictionaries.body_tests_name')} />
                                    <ErrorMessage name="name" component="div" />
                                </div>
                                <div>
                                    <Field name="description" type="text" style={{ width: '100%', padding: '0.5em', borderRadius: '6px' }} placeholder={t('dictionaries.body_tests_description')} />
                                    <ErrorMessage name="description" component="div" />
                                </div>
                                <div>
                                    <Field name="purpose" type="text" style={{ width: '100%', padding: '0.5em', borderRadius: '6px' }} placeholder={t('dictionaries.body_tests_purpose')} />
                                    <ErrorMessage name="purpose" component="div" />
                                </div>
                            </div>
                            <div>
                                <button type="submit" className="field" disabled={formik.isSubmitting}>{t('buttons.add')}</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </div>
    );
};

export default AddNewBodyTest;
