import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUpdateClientBodyTest } from "../../../../../../services/bodyTests/ClientBodyTestsTanstackService";
import DictBodyTestService from "../../../../../../services/dict/DictBodyTestService";
import { DictBodyTest, ClientBodyTest } from "../../../../../../types/types";
import Modal from "../../../../../../constants/Modal";

type Props = {
  test: ClientBodyTest;
  clientId: string;
  onUpdated: (updated: ClientBodyTest) => void;
  onClose: () => void;
};

const OptionsEdit: React.FC<Props> = ({ test, clientId, onUpdated, onClose }) => {
  const { t } = useTranslation("global");
  const [dictBodyTests, setDictBodyTests] = useState<DictBodyTest[]>([]);
  const { mutateAsync: updateClientBodyTest } = useUpdateClientBodyTest();

  useEffect(() => {
    DictBodyTestService.getDictBodyTest()
      .then((res) => setDictBodyTests(res.data))
      .catch((err) => console.error("Błąd pobierania słownika:", err));
  }, []);

  const validationSchema = Yup.object({
    dictBodyTestId: Yup.string().required(t("validation.this_field_is_required")),
    result: Yup.string().required(t("validation.this_field_is_required")),
  });

  const initialValues = {
    id: test.id,
    dictBodyTestId: test.dict_body_test_id || "",
    result: test.result || "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const payload = {
        id: test.id,
        dict_body_test_id: values.dictBodyTestId,
        result: values.result,
      };

      const response = await updateClientBodyTest({
        testId: test.id,
        clientId,
        payload,
      });
      onUpdated(response.data);
      onClose();
    } catch (error) {
      console.error("Błąd aktualizacji:", error);
    }
  };

  return (
    <Modal show={true} onClose={onClose} title={t("buttons.edit")}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            <div className="form-container">
              <div>
                <ErrorMessage name="dictBodyTestId" component="div" className="error" />
                <Field
                  as="select"
                  name="dictBodyTestId"
                  className="select-field"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFieldValue("dictBodyTestId", e.target.value)
                  }
                >
                  <option value="" disabled>
                    {t("dictionaries.select_test")}
                  </option>
                  {dictBodyTests.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Field>
              </div>
              <div>
                <ErrorMessage name="result" component="div" className="error" />
                <Field name="result" type="text" placeholder={t("dictionaries.result")} />
              </div>
              <button type="submit">{t("buttons.save")}</button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default OptionsEdit;