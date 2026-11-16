import React, { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { withTranslation } from "react-i18next";
import AuthService from "../../services/auth.service";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../constants/api";
import Modal from "../../constants/Modal";
import Terms from "../../constants/Terms";
import Privacy from "../../constants/Privacy";



type Props = {
  t: any;
};

type State = {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
  successful: boolean;
  message: string;
  role: string[];
  termsAccepted: boolean;
  privacyAccepted: boolean;
  recaptchaToken: string | null;
  showTermsModal: boolean;
  showPrivacyModal: boolean;
};

class RegisterUser extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onRecaptchaChange = this.onRecaptchaChange.bind(this);
    this.showTermsModal = this.showTermsModal.bind(this);
    this.hideTermsModal = this.hideTermsModal.bind(this);
    this.showPrivacyModal = this.showPrivacyModal.bind(this);
    this.hidePrivacyModal = this.hidePrivacyModal.bind(this);

    this.state = {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
      successful: false,
      message: "",
      role: [],
      termsAccepted: false,
      privacyAccepted: false,
      recaptchaToken: null,
      showTermsModal: false,
      showPrivacyModal: false,
    };
  }

  validationSchema() {
    return Yup.object().shape({
      username: Yup.string()
        .test(
          "len",
          "The username must be between 3 and 20 characters.",
          (val: any) =>
            val && val.toString().length >= 3 && val.toString().length <= 20
        )
        .required("This field is required!"),
      email: Yup.string()
        .email("This is not a valid email.")
        .required("This field is required!"),
      password: Yup.string()
        .test(
          "len",
          "The password must be between 6 and 40 characters.",
          (val: any) =>
            val && val.toString().length >= 6 && val.toString().length <= 40
        )
        .required("This field is required!"),
      repeatPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required("This field is required!"),
      role: Yup.string().required("This field is required!"),
      termsAccepted: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
      privacyAccepted: Yup.boolean().oneOf([true], "You must accept the privacy policy"),
      recaptchaToken: Yup.string().required("Please complete the reCAPTCHA")
    });
  }

  onRecaptchaChange(token: string | null) {
    this.setState({ recaptchaToken: token });
  }

  handleRegister(formValue: { username: string; email: string; password: string; repeatPassword: string; role: string; termsAccepted: boolean; privacyAccepted: boolean; recaptchaToken: string | null }) {
    const { username, email, password } = formValue;

    this.setState({
      message: "",
      successful: false,
    });

    AuthService.register(username, email, password, "user").then(
      (response) => {
        this.setState({
          message: response.data.message,
          successful: true,
        });
      },
      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();

        this.setState({
          successful: false,
          message: resMessage,
        });
      }
    );
  }

  showTermsModal() {
    this.setState({ showTermsModal: true });
  }

  hideTermsModal() {
    this.setState({ showTermsModal: false });
  }

  showPrivacyModal() {
    this.setState({ showPrivacyModal: true });
  }

  hidePrivacyModal() {
    this.setState({ showPrivacyModal: false });
  }

  render() {
    const { successful, message, showTermsModal, showPrivacyModal } = this.state;
    const { t } = this.props;

    const initialValues = {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
      role: "",
      termsAccepted: false,
      privacyAccepted: false,
      recaptchaToken: null,
    };

    return (
      <div className="center">


        <Formik
          initialValues={initialValues}
          validationSchema={this.validationSchema()}
          onSubmit={this.handleRegister}
        >
          {({ setFieldValue, values }) => (
            <Form className="center">
              {!successful && (
                <div className="center">
                  <div>
                    <Field name="username" type="text" placeholder={t("login.username")} className="form-field" />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div>
                    <Field
                      name="email"
                      type="text"
                      inputMode="email"
                      autoComplete="email"
                      placeholder={t("login.email")}
                      className="form-field"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div>
                    <Field name="password" type="password" placeholder={t("login.password")} className="form-field" />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div>
                    <Field name="repeatPassword" type="password" placeholder={t("login.repeat_password")} className="form-field" />
                    <ErrorMessage
                      name="repeatPassword"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", marginTop: "10px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Field type="checkbox" name="termsAccepted" />
                      <span
                        onClick={this.showTermsModal}
                        className="consent"
                        style={{ cursor: "pointer", textDecoration: "underline" }}
                      >
                        {t("login.terms_accepted")}
                      </span>
                    </label>
                    <ErrorMessage
                      name="termsAccepted"
                      component="div"
                      className="alert alert-danger"
                    />

                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Field type="checkbox" name="privacyAccepted" />
                      <span
                        onClick={this.showPrivacyModal}
                        className="consent"
                        style={{ cursor: "pointer", textDecoration: "underline" }}
                      >
                        {t("login.privacy_accepted")}
                      </span>
                    </label>
                    <ErrorMessage
                      name="privacyAccepted"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div>
                    <ReCAPTCHA
                      sitekey={RECAPTCHA_SITE_KEY}
                      onChange={(token) => {
                        setFieldValue("recaptchaToken", token);
                        this.onRecaptchaChange(token);
                      }}
                    />
                    <ErrorMessage
                      name="recaptchaToken"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>
                  <div>
                    <button type="submit"
                      disabled={!values.termsAccepted || !values.privacyAccepted}
                      style={{
                        opacity: values.termsAccepted && values.privacyAccepted ? 1 : 0.5,
                        cursor: values.termsAccepted && values.privacyAccepted ? "pointer" : "not-allowed",
                      }}>
                      {t("login.register")}
                    </button>
                  </div>

                  <div>
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
                      >
                        Register with Facebook
                      </button>
                    </a>
                  </div>
                </div>
              )}

              {message && (
                <div className="field-container">
                  <div
                    className={
                      successful ? "alert alert-success" : "alert alert-danger"
                    }
                    role="alert"
                  >
                    {message}
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>

        <Modal show={showTermsModal} onClose={this.hideTermsModal} title={t("login.terms")}>
          <Terms />
        </Modal>

        <Modal show={showPrivacyModal} onClose={this.hidePrivacyModal} title={t("login.privacy")}>
          <Privacy />
        </Modal>
      </div>
    );
  }
}

export default withTranslation("global")(RegisterUser);

