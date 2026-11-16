import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { withTranslation } from "react-i18next";
import AuthService from "../../services/auth.service";
import Modal from "../../constants/Modal";

type Props = {
  t: any;
};

const ResetPassword: React.FC<Props> = ({ t }) => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(true);

  const validationSchema = () => {
    return Yup.object().shape({
      newPassword: Yup.string()
        .required(t("login.new_password_required")),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], t("login.passwords_must_match"))
        .required(t("login.confirm_password_required")),
    });
  };

  const handleResetPassword = (formValue: { newPassword: string; confirmPassword: string }) => {
    const { newPassword } = formValue;
    const token = searchParams.get("token") || "";

    setLoading(true);

    AuthService.resetPassword(token, newPassword).then(
      (response) => {
        setMessage(response.data.message);
        setLoading(false);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  return (
    <Modal
      show={showModal}
      onClose={() => setShowModal(false)}
      title={t("login.reset_password")}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleResetPassword}
      >
        <Form>
          <div>
            <div>
              <Field name="newPassword" type="password" placeholder={t("login.password")} className="field" />
              <ErrorMessage name="newPassword" component="div" className="error" />
            </div>

            <div>
              <Field name="confirmPassword" type="password" placeholder={t("login.repeat_password")} className="field" />
              <ErrorMessage name="confirmPassword" component="div" className="error" />
            </div>

            <div>
              <button type="submit" className="field" disabled={loading}>
                {loading && <span className="spinner-border spinner-border-sm"></span>}
                {t("login.reset")}
              </button>
            </div>

            {message && (
              <div className="field-container">
                <div className="error" role="alert">
                  {message}
                </div>
              </div>
            )}
          </div>
        </Form>
      </Formik>
    </Modal>
  );
};

export default withTranslation("global")(ResetPassword);
