import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import Modal from "../../../../../constants/Modal";
import { Goal, UpdateGoal } from "../../../../../types/types";
import { usePutGoal } from "../../../../../services/goals/GoalsTanstackService";

type Props = {
  goal: Goal;
  onUpdated: (updated: Goal) => void;
  onClose: () => void;
};

const OptionsEdit: React.FC<Props> = ({ goal, onUpdated, onClose }) => {
  const { t } = useTranslation("global");
  const updateGoal = usePutGoal();

  const validationSchema = Yup.object({
    value: Yup.string().required(t("validation.this_field_is_required")),
    goalDate: Yup.string().required(t("validation.this_field_is_required")),
    action: Yup.string().required(t("validation.this_field_is_required")),
  });

  const initialValues = {
    value: goal.value,
    goalDate: goal.goalDate.toString().split("T")[0],
    action: goal.action,
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const payload: UpdateGoal = {
        id: goal.id,
        clientId: goal.clientId,
        dictBodyParamId: (goal as any).dictBodyParamId || null,
        dictBodyTestId: (goal as any).dictBodyTestId || null,
        dictUnitId: (goal as any).dictUnitId,
        action: values.action,
        value: values.value,
        goalDate: values.goalDate,
      };

      const response = await updateGoal.mutateAsync(payload);
      onUpdated(response);
      onClose();
    } catch (error) {
      console.error("Błąd aktualizacji celu:", error);
    }
  };

  return (
    <Modal show={true} onClose={onClose} title={t("buttons.edit")}>
      <p>{goal.dictBodyParam} {goal.dictBodyTest}</p>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
            <div>
              <ErrorMessage name="action" component="div" className="error" />
              <Field as="select" name="action" className="field">
                <option value="" disabled hidden>
                  {t("clients.action")}
                </option>
                <option value="increase">{t("clients.increase")}</option>
                <option value="decrease">{t("clients.decrease")}</option>
                <option value="maintain">{t("clients.maintain")}</option>
              </Field>
            </div>
            <div>
              <ErrorMessage name="value" component="div" className="error" />
              <Field name="value" type="text" placeholder={t("clients.value")} className="field"/>
            </div>
            <div>
              <ErrorMessage name="goalDate" component="div" className="error" />
              <Field name="goalDate" type="date" className="field"/>
            </div>
            <button type="submit" className="field">{t("buttons.save")}</button>
         
        </Form>
      </Formik>
    </Modal>
  );
};

export default OptionsEdit;
