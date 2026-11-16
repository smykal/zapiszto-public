import React, { useState } from "react";
import { BodyParamsItem } from '../../../types/types';
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Modal from "../../../constants/Modal";
import { useUpdateBodyParam } from "../../../services/bodyParams/BodyParamsTanstackService";

type EditProps = {
  item: BodyParamsItem;
  onUpdate: () => void;
  t: any;
};

const OptionsEdit: React.FC<EditProps> = ({ item, onUpdate, t }) => {
  const [showModal, setShowModal] = useState(false);
  const { mutateAsync: updateBodyParam, isPending } = useUpdateBodyParam();

  const validationSchema = Yup.object().shape({
    value: Yup.number().required(t("validation.this_field_is_required")),
    insert_date: Yup.string().required(t("validation.this_field_is_required")),
  });

  const handleUpdate = async (values: BodyParamsItem) => {
    const dateWithSeconds = values.insert_date.includes("Z")
      ? values.insert_date
      : `${values.insert_date}:00Z`;

    const payload = {
      ...values,
      insert_date: dateWithSeconds,
    };

    try {
      await updateBodyParam({ id: item.id, updatedParam: payload });
      onUpdate();
      setShowModal(false);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <>
      <div>
        <button onClick={() => setShowModal(true)}>
          {t("buttons.edit")}
        </button>
        <br /><br />
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={t("buttons.edit")}
      >
        <Formik
          initialValues={{
            ...item,
            insert_date: new Date(item.insert_date).toISOString().slice(0, 16),
          }}
          validationSchema={validationSchema}
          onSubmit={handleUpdate}
        >
          {({ isSubmitting }) => (
            <Form>
              <div style={{
                display: "grid",
                gap: "1em",
                gridTemplateColumns: "1fr 2fr",
                alignItems: "center"
              }}>
                <label style={{ justifySelf: "center" }}>{t("table.value")}</label>
                <Field type="number" name="value" className="field" />

                <label style={{ justifySelf: "center" }}>{t("table.date")}</label>
                <Field type="datetime-local" name="insert_date" className="field" />

                <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
                  <button type="submit" disabled={isSubmitting || isPending} className="field">{t("buttons.save")}</button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default OptionsEdit;
