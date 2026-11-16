import React, { Component } from "react";
import { Capacitor } from '@capacitor/core';
import { Formik, Field, Form, ErrorMessage } from "formik";
import IUser from "../../types/user.type";
import { Navigate } from "react-router-dom";
import * as Yup from "yup";
import { withTranslation } from "react-i18next";
import AuthService from "../../services/auth.service";
import Modal from "../../constants/Modal";
import RecoverPassword from "./RecoverPassword";
import Spinner from "../../common/Spinner";

type Props = {
  t: any;
  updateUserState: (user: IUser) => void;
};

type State = {
  redirect: string | null,
  username: string,
  password: string,
  loading: boolean,
  message: string,
  showRecoverPassword: boolean,
  facebookSpinner: boolean,
  showPassword: boolean
};

class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleShowRecoverPassword = this.handleShowRecoverPassword.bind(this);
    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this);

    this.state = {
      redirect: null,
      username: "",
      password: "",
      loading: false,
      message: "",
      showRecoverPassword: false,
      facebookSpinner: false,
      showPassword: false
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (currentUser) {
      if (currentUser.roles.includes("ROLE_USER")) {
        this.setState({ redirect: "/training" });
      } else if (currentUser.roles.includes("ROLE_TRAINER")) {
        this.setState({ redirect: "/programs" });
      }
    }
  }

  validationSchema() {
    return Yup.object().shape({
      username: Yup.string().required("This field is required!"),
      password: Yup.string().required("This field is required!"),
    });
  }

  handleLogin(formValue: { username: string; password: string }) {
    const { username, password } = formValue;
    const { updateUserState } = this.props;

    this.setState({
      message: "",
      loading: true
    });

    AuthService.login(username, password).then(
      (data) => {
        updateUserState(data);
        if (data.roles.includes("ROLE_USER")) {
          this.setState({ redirect: "/training" });
        } else if (data.roles.includes("ROLE_TRAINER")) {
          this.setState({ redirect: "/programs" });
        } else {
          this.setState({ redirect: "/profile" });
        }
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        this.setState({
          loading: false,
          message: resMessage
        });
      }
    );
  }

  handleShowRecoverPassword() {
    this.setState({
      showRecoverPassword: true
    });
  }

  togglePasswordVisibility() {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword
    }));
  }

  runFacebookSpinner() {
    this.setState({ facebookSpinner: true });
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }

    const isNative = Capacitor.isNativePlatform();
    const { t } = this.props;
    const { loading, message, showRecoverPassword, facebookSpinner, showPassword } = this.state;

    const initialValues = {
      username: "",
      password: "",
    };

    return (
      <>
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={this.validationSchema()}
            onSubmit={this.handleLogin}
          >
            <Form>
              <div className="center">
                <Field
                  name="username"
                  type="text"
                  placeholder={t("login.username")}
                  className="width_15rem"
                />
                <ErrorMessage name="username" component="div" />
              </div>

              <div className="center">
                <div>
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("login.password")}
                    className="width_15rem"
                  />
                </div>
                <ErrorMessage name="password" component="div" />

                <div className="password-actions">
                  <button
                    type="button"
                    onClick={this.handleShowRecoverPassword}
                    className="password-toggle password-action-left"
                  >
                    {t("login.forgot_password")}
                  </button>
                  <button
                    type="button"
                    onClick={this.togglePasswordVisibility}
                    className="password-toggle password-action-right"
                    aria-label={showPassword ? t("login.hide_password") : t("login.show_password")}
                  >
                    {showPassword ? t("login.hide_password") : t("login.show_password")}
                  </button>
                </div>

              </div>

              <div className="centered-button">
                <div>
                  {loading ? (
                    <span className="loader"></span>
                  ) : (
                    <button
                      type="submit"
                      className="field width_15rem">
                      {t("login.login")}
                    </button>
                  )}
                </div>

                {/*facebook logowanie */}
                {facebookSpinner ? (
                  <Spinner />
                ) : (
                  <div>
                    <a
                      href={
                        isNative
                          ? "https://zapiszto-service.onrender.com/api/auth/facebook-android"
                          : "https://zapiszto-service.onrender.com/oauth2/authorization/facebook"
                      }
                    >
                      <button
                        type="button"
                        style={{ color: "#1877F2" }}
                        className="field width_15rem"
                        onClick={() => this.runFacebookSpinner()}
                      >
                        {t("login.login_with")} {t("login.facebook")}
                      </button>
                    </a>
                  </div>)}
                {/*facebook logowanie */}

              </div>

              {message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                </div>
              )}
            </Form>
          </Formik>
        </div>
        <Modal
          show={showRecoverPassword}
          onClose={() => this.setState({ showRecoverPassword: false })}
          title={t("login.recover_password")}
        >
          <RecoverPassword />
        </Modal>
      </>
    );
  }
}

export default withTranslation("global")(Login);