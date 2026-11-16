import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Client } from '../../../../types/types';
import DictBodyTestService from '../../../../services/dict/DictBodyTestService';
import { useGetDictUnits } from '../../../../services/dict/DictUnitsTanstackService';
import { useGetDictBodyParams } from '../../../../services/bodyParams/BodyParamsTanstackService';
import { usePostNewGoal } from '../../../../services/goals/GoalsTanstackService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { DictBodyParam, DictBodyTest, DictUnits, NewGoal } from '../../../../types/types';
import * as Yup from 'yup';

interface ClientDetailsProps {
    client: Client;
}

const AddGoals: React.FC<ClientDetailsProps & { onGoalAdded: () => void }> = ({ client, onGoalAdded }) => {
    const { t } = useTranslation('global');
    const [bodyParameters, setBodyParameters] = useState<DictBodyParam[]>([]);
    const [bodyTests, setBodyTests] = useState<DictBodyTest[]>([]);
    const [units, setUnits] = useState<DictUnits[]>([]);
    const [selectedOption, setSelectedOption] = useState<'bodyParam' | 'bodyTest' | null>(null);
    const { data: fetchedUnits } = useGetDictUnits();
    const { data: fetchedBodyParameters = [] } = useGetDictBodyParams();
    const postNewGoal = usePostNewGoal();

    useEffect(() => {
        setBodyParameters(fetchedBodyParameters);
    }, [fetchedBodyParameters]);

    useEffect(() => {
        DictBodyTestService.getDictBodyTest()
            .then((response: { data: DictBodyTest[] }) => {
                setBodyTests(response.data);
            })
            .catch((error: any) => {
                console.error('Error fetching body tests:', error);
            });
    }, []);

    useEffect(() => {
        if (fetchedUnits) {
            setUnits(fetchedUnits);
        }
    }, [fetchedUnits]);

    // Walidacja formularza za pomocą Yup
    const validationSchema = Yup.object({
        dictBodyParamId: Yup.number().nullable(),
        dictBodyTestId: Yup.string().nullable(),
        dictUnitId: Yup.string().required(t('required')),
        action: Yup.string().required(t('required')),
        value: Yup.string().required(t('required')),
        goalDate: Yup.string().required(t('required')),
    }).test(
        'bodyParamOrTest',
        t('required'),
        function (_, context) {
            const { dictBodyParamId, dictBodyTestId } = this.parent;
            const selectedOption = context?.options?.context?.selectedOption;

            if (selectedOption === 'bodyParam' && !dictBodyParamId) {
                return this.createError({ path: 'dictBodyParamId', message: t('required') });
            }
            if (selectedOption === 'bodyTest' && !dictBodyTestId) {
                return this.createError({ path: 'dictBodyTestId', message: t('required') });
            }
            return true;
        }
    );

    return (
        <div>
            <Formik
                initialValues={{
                    id: crypto.randomUUID(),
                    dictBodyParamId: '',
                    dictBodyTestId: '',
                    dictUnitId: '',
                    action: '',
                    value: '',
                    goalDate: '',
                }}
                validateOnBlur={true}
                validateOnChange={true}
                validate={values => {
                    try {
                        validationSchema.validateSync(values, { context: { selectedOption }, abortEarly: false });
                        return {};
                    } catch (err: any) {
                        return err.inner?.reduce((acc: any, cur: any) => {
                            acc[cur.path] = cur.message;
                            return acc;
                        }, {}) ?? {};
                    }
                }}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    const newGoal: NewGoal = {
                        id: values.id,
                        clientId: client.id,
                        dictBodyParamId: values.dictBodyParamId ? String(values.dictBodyParamId) : '',
                        dictBodyTestId: values.dictBodyTestId ? String(values.dictBodyTestId) : '',
                        dictUnitId: String(values.dictUnitId),
                        action: values.action,
                        value: values.value,
                        goalDate: values.goalDate,
                    };
                    try {
                        await postNewGoal.mutateAsync(newGoal);
                        resetForm();
                        onGoalAdded();
                    } catch (error) {
                        console.error('Error adding goal:', error);
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ isSubmitting, setFieldValue }) => (
                    <Form>
                        <div>
                            {/* Radio przyciski wyboru */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Field
                                        type="radio"
                                        name="selection"
                                        value="bodyParam"
                                        checked={selectedOption === 'bodyParam'}
                                        onChange={() => {
                                            setSelectedOption('bodyParam');
                                            setFieldValue('dictBodyTestId', null); // resetuj drugie pole
                                        }}
                                    />
                                    {t('clients.select_body_param')}
                                </label>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Field
                                        type="radio"
                                        name="selection"
                                        value="bodyTest"
                                        checked={selectedOption === 'bodyTest'}
                                        onChange={() => {
                                            setSelectedOption('bodyTest');
                                            setFieldValue('dictBodyParamId', null); // resetuj drugie pole
                                        }}
                                    />
                                    {t('clients.select_body_test')}
                                </label>
                            </div>

                            {/* Pokazuj resztę formularza tylko gdy wybrano jedną z opcji */}
                            {selectedOption !== null && (
                                <>
                                    <div>
                                        {selectedOption === 'bodyParam' && (
                                            <div>
                                                <ErrorMessage name="dictBodyParamId" component="div" className="error" />
                                                <Field
                                                    as="select"
                                                    name="dictBodyParamId"
                                                    className="field"
                                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                        setFieldValue('dictBodyParamId', Number(e.target.value))
                                                    }
                                                >
                                                    <option value="" disabled hidden>
                                                        {t('clients.select_body_param')}
                                                    </option>
                                                    {bodyParameters.map((param) => (
                                                        <option key={param.id} value={param.id}>
                                                            {param.name}
                                                        </option>
                                                    ))}
                                                </Field>
                                            </div>
                                        )}
                                        {selectedOption === 'bodyTest' && (
                                            <div>
                                                <ErrorMessage name="dictBodyTestId" component="div" className="error" />
                                                <Field
                                                    as="select"
                                                    name="dictBodyTestId"
                                                    className="field"
                                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                        setFieldValue('dictBodyTestId', e.target.value)
                                                    }
                                                >
                                                    <option value="" disabled hidden>
                                                        {t('clients.select_body_test')}
                                                    </option>
                                                    {bodyTests.map((test) => (
                                                        <option key={test.id} value={test.id}>
                                                            {test.name}
                                                        </option>
                                                    ))}
                                                </Field>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Field
                                            as="select"
                                            name="dictUnitId"
                                            className="field"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                setFieldValue('dictUnitId', e.target.value)
                                            }
                                        >
                                            <option value="" disabled hidden>
                                                {t('clients.select_unit')}
                                            </option>
                                            {units.map((unit) => (
                                                <option key={unit.id} value={unit.id}>
                                                    {unit.name} ({unit.shortcut})
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="dictUnitId" component="div" />
                                    </div>

                                    <div>
                                        <ErrorMessage name="action" component="div" />
                                        <Field
                                            as="select"
                                            name="action"
                                            className="field"
                                            placeholder={t('clients.action')}
                                        >
                                            <option value="" disabled hidden>
                                                {t('clients.action')}
                                            </option>
                                            <option value="increase">{t('clients.increase')}</option>
                                            <option value="decrease">{t('clients.decrease')}</option>
                                            <option value="maintain">{t('clients.maintain')}</option>
                                        </Field>
                                    </div>

                                    <div>
                                        <ErrorMessage name="value" component="div" />
                                        <Field
                                            type="text"
                                            name="value" placeholder={t('clients.value')}
                                            className="field"
                                        />
                                    </div>

                                    <div>
                                        <ErrorMessage name="goalDate" component="div" />
                                        <Field type="date" name="goalDate" className="field" />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="width_15rem">
                                        {t('buttons.add')}
                                    </button>

                                </>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddGoals;
