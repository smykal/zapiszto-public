import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Client, NewClientBodyTest, DictBodyTest } from '../../../../../types/types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { usePostClientBodyTestPerUser } from '../../../../../services/bodyTests/ClientBodyTestsTanstackService';
import DictBodyTestService from '../../../../../services/dict/DictBodyTestService';
import AddNewBodyTest from './AddNewBodyTest';

interface AddClientBodyTestProps {
    client: Client;
    onClose: () => void;
}

const AddClientBodyTest: React.FC<AddClientBodyTestProps> = ({ client, onClose }) => {
    const { t } = useTranslation('global');
    const [dictBodyTests, setDictBodyTests] = useState<DictBodyTest[]>([]);
    const { mutateAsync: postClientBodyTest } = usePostClientBodyTestPerUser();

    useEffect(() => {
        DictBodyTestService.getDictBodyTest()
            .then(response => {
                setDictBodyTests(response.data);
            })
            .catch(error => {
                console.error('Błąd podczas pobierania danych:', error);
            });
    }, []);

    const validationSchema = Yup.object({
        dictBodyTestId: Yup.string().required(t('validation.this_field_is_required')),
        result: Yup.string().required(t('validation.this_field_is_required')),
    });

    const initialValues = {
        id: crypto.randomUUID(),
        clientId: client.id,
        dictBodyTestId: '',
        result: ''
    };

    const handleSubmit = async (values: { id: string; clientId: string; dictBodyTestId: string; result: string }) => {
        const requestBody: NewClientBodyTest = {
            id: values.id,
            clientId: values.clientId,
            dictBodyTestId: values.dictBodyTestId,
            result: values.result
        };

        try {
            await postClientBodyTest(requestBody);
            onClose();
        } catch (error) {
            console.error('Błąd podczas wysyłania zapytania:', error);
        }
    };

    return (
        <div>
            <AddNewBodyTest client={client}/>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue }) => (
                    <Form>
                        <div>
                            <ErrorMessage name="dictBodyTestId" component="div" className="error" />
                            <Field as="select" name="dictBodyTestId" className="field" placeholder={t('dictionaries.select_test')} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFieldValue('dictBodyTestId', e.target.value)}>
                                <option value="" disabled>
                                    {t('dictionaries.select_test')}
                                </option>
                                {dictBodyTests.map(test => (
                                    <option key={test.id} value={test.id}>
                                        {test.name}
                                    </option>
                                ))}
                            </Field>
                        </div>
                        <div>
                            <ErrorMessage name="result" component="div" className="error" />
                            <Field name="result" type="text" placeholder={t('dictionaries.result')} className="field" />
                        </div>
                        <button type="submit" className="field">{t('buttons.add')}</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddClientBodyTest;
