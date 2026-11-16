// src/components/register/RegisterBody.tsx
import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../constants/api";
import AuthService from "../../services/auth.service";
import Modal from "../../constants/Modal";
import Terms from "../../constants/Terms";
import Privacy from "../../constants/Privacy";

type Props = {
  t: any;
  role: "user" | "trainer";
};

const RegisterBody: React.FC<Props> = ({ t, role }) => {
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "The username must be between 3 and 20 characters.")
      .max(20, "The username must be between 3 and 20 characters.")
      .required("This field is required!"),
    email: Yup.string()
      .email("This is not a valid email.")
      .required("This field is required!"),
    password: Yup.string()
      .min(6, "The password must be between 6 and 40 characters.")
      .max(40, "The password must be between 6 and 40 characters.")
      .required("This field is required!"),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("This field is required!"),
    termsAccepted: Yup.boolean().oneOf([true], "You must accept the terms"),
    privacyAccepted: Yup.boolean().oneOf([true], "You must accept the privacy policy"),
    recaptchaToken: Yup.string().required("Please complete the reCAPTCHA"),
  });

  const handleRegister = (formValue: {
    username: string;
    email: string;
    password: string;
  }) => {
    const { username, email, password } = formValue;
    setMessage("");
    setSuccessful(false);

    AuthService.register(username, email, password, role).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
      },
      (error) => {
        const resMessage =
          (error.response?.data?.message) || error.message || error.toString();
        setSuccessful(false);
        setMessage(resMessage);
      }
    );
  };

  const initialValues = {
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    termsAccepted: false,
    privacyAccepted: false,
    recaptchaToken: null,
  };

  return (
    <div className="center">
      <div style={{ color: "var(--color07)" }}>
        {role === "trainer" ? (
          <> {t("login.trainer_registration_info")} </>
        ) : role === "user" ? (
          <> {t("login.user_registration_info")} </>
        ) : null}
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
      >
        {({ setFieldValue, values }) => (
          <Form className="center">
            {!successful && (
              <div className="center">
                <Field
                  name="username"
                  type="text"
                  placeholder={t("login.username")}
                  className="width_15rem" />
                <ErrorMessage name="username" component="div" className="alert" />

                <Field
                  name="email"
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={t("login.email")}
                  className="width_15rem"
                />
                <ErrorMessage name="email" component="div" className="alert" />

                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("login.password")}
                  className="width_15rem"
                />
                <ErrorMessage name="password" component="div" className="alert" />

                <Field
                  name="repeatPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("login.repeat_password")}
                  className="width_15rem"
                />
                <ErrorMessage name="repeatPassword" component="div" className="alert" />

                <button
                  type="button"
                  onClick={() => setShowPassword((previousValue) => !previousValue)}
                  className="password-toggle"
                  aria-label={showPassword ? t("login.hide_password") : t("login.show_password")}
                >
                  {showPassword ? t("login.hide_password") : t("login.show_password")}
                </button>

                {/* ✅ Zgody */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", marginTop: "10px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Field type="checkbox" name="termsAccepted" />
                    <span onClick={() => setShowTermsModal(true)} className="consent">
                      {t("login.terms_accepted")}
                    </span>
                  </label>
                  <ErrorMessage name="termsAccepted" component="div" className="alert" />

                  <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Field type="checkbox" name="privacyAccepted" />
                    <span onClick={() => setShowPrivacyModal(true)} className="consent">
                      {t("login.privacy_accepted")}
                    </span>
                  </label>
                  <ErrorMessage name="privacyAccepted" component="div" className="alert" />
                </div>

                {/* ✅ reCAPTCHA */}
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={(token) => setFieldValue("recaptchaToken", token)}
                />
                <ErrorMessage name="recaptchaToken" component="div" className="alert" />

                {/* ✅ Submit */}
                <button
                  type="submit"
                  disabled={!values.termsAccepted || !values.privacyAccepted}
                  style={{
                    opacity: values.termsAccepted && values.privacyAccepted ? 1 : 0.5,
                    cursor: values.termsAccepted && values.privacyAccepted ? "pointer" : "not-allowed",
                  }}
                  className="field width_15rem"
                >
                  {t("login.register")}
                </button>

                {/* ✅ Facebook */}
                {role === "user" && (
                  <a
                    href={
                      values.termsAccepted && values.privacyAccepted
                        ? `https://zapiszto-service.onrender.com/oauth2/authorization/facebook`
                        : undefined
                    }
                    onClick={(e) => {
                      if (!values.termsAccepted || !values.privacyAccepted) {
                        e.preventDefault();
                        alert(t("login.accept_terms_privacy_first"));
                      }
                    }}
                  >
                    <button
                      type="button"
                      disabled={!values.termsAccepted || !values.privacyAccepted}
                      style={{
                        color: "#1877F2",
                        opacity: values.termsAccepted && values.privacyAccepted ? 1 : 0.5,
                        cursor: values.termsAccepted && values.privacyAccepted ? "pointer" : "not-allowed",
                      }}
                      className="width_15rem"
                    >
                      {t("login.register_with_facebook")}
                    </button>
                  </a>
                )}
              </div>
            )}

            {message && (
              <div className="field-container">
                <div
                  className={successful ? "alert alert-success" : "alert alert-danger"}
                  role="alert"
                >
                  {message}
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>

      {/* ✅ Modale */}
      <Modal
        show={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title={t("login.terms")}>
        <Terms />
      </Modal>

      <Modal
        show={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title={t("login.privacy")}>
        <Privacy />
      </Modal>
    </div>
  );
};

export default RegisterBody;
