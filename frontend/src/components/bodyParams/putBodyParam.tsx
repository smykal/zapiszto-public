import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  useGetDictBodyParams,
  usePostBodyParam,
} from '../../services/bodyParams/BodyParamsTanstackService';
import { useTranslation } from 'react-i18next';
import { BodyParamDto, DictBodyParam } from '../../types/types';
import Modal from '../../constants/Modal';

type Props = {
  clientId: string | null;
  updateData?: () => void;
};

const PutBodyParam: React.FC<Props> = ({ clientId, updateData }) => {
  const { t } = useTranslation('global');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: dictionaryData = [], isLoading: isDictionaryLoading } = useGetDictBodyParams();
  const { mutateAsync: postBodyParam } = usePostBodyParam();
  const bodyParameters = [...dictionaryData].sort(
    (a: DictBodyParam, b: DictBodyParam) => a.name.localeCompare(b.name)
  );

  const validationSchema = Yup.object().shape({
    dictBodyParam: Yup.number().required(t('validation.this_field_is_required')),
    value: Yup.number()
      .required(t('validation.this_field_is_required'))
      .test('is-decimal-one', t('validation.one_decimal_field'), (value) =>
        /^\d+(\.\d{1})?$/.test(String(value))
      ),
  });

  const handlePost = async (formValue: { dictBodyParam: string; value: string }, { resetForm }: any) => {
    const bodyParamDto: BodyParamDto = {
      dict_body_params_id: Number(formValue.dictBodyParam),
      value: formValue.value,
      clientId: clientId || '',
    };

    await postBodyParam(bodyParamDto);
    if (updateData) updateData();
    resetForm();
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Przycisk otwierający modal */}
      <div className="center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="width_15rem"
        >
          {t('buttons.add_body_param')}
        </button>
      </div>

      {/* Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('body_params.add_body_param')}>
        <Formik initialValues={{ dictBodyParam: '', value: '' }} validationSchema={validationSchema} onSubmit={handlePost}>
          {({ isSubmitting }) => (
            <Form>
              <div>
                <div>
                  <Field
                    as="select"
                    name="dictBodyParam"
                    className="field"
                  >
                    <option value="" disabled>{t('buttons.select_attribute')}</option>
                    {isDictionaryLoading ? (
                      <option disabled>{t('common.loading')}</option>
                    ) : bodyParameters.map((param) => (
                      <option key={param.id} value={param.id}>{param.name}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="dictBodyParam" component="div" className="error" />
                </div>

                <div>
                  <Field name="value"
                    type="number"
                    step="0.1"
                    className="field width_15rem"
                    placeholder={t('table.value')}
                    style={{ width: '100%', display: 'block', margin: '0 auto' }}
                  />
                  <div style={{ width: '150px', display: 'block', margin: '0 auto' }}>
                    <ErrorMessage name="value" component="div" className="error" />
                  </div>
                </div>

                <div className="center" style={{ marginTop: '10px' }}>
                  <button type="submit" className="field width_15rem" disabled={isSubmitting}>
                    {t('buttons.add_body_param')}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default PutBodyParam;
