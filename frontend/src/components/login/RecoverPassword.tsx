import React, { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { withTranslation } from "react-i18next";
import AuthService from "../../services/auth.service";

type Props = {
  t: any;
  onClose?: () => void;
};

type State = {
  email: string,
  loading: boolean,
  message: string
};

class RecoverPassword extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleRecoverPassword = this.handleRecoverPassword.bind(this);

    this.state = {
      email: "",
      loading: false,
      message: ""
    };
  }

  validationSchema() {
    return Yup.object().shape({
      email: Yup.string().email("Invalid email format").required("This field is required!")
    });
  }

  handleRecoverPassword(formValue: { email: string }) {
    const { email } = formValue;

    this.setState({
      message: "",
      loading: true
    });

    AuthService.forgotPassword(email).then(
      response => {
        this.setState({
          message: response.data.message,
          loading: false
        });
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

  render() {
    const { t } = this.props;
    const { loading, message } = this.state;

    const initialValues = {
      email: "",
    };

    return (
      <>
        <div>
          {this.props.onClose && (
            <button onClick={this.props.onClose}>{t("buttons.close")}</button>
          )}
          <div className="center">
            <Formik
              initialValues={initialValues}
              validationSchema={this.validationSchema}
              onSubmit={this.handleRecoverPassword}
            >
              <Form>
                <div>
                  <Field
                    name="email"
                    type="email"
                    placeholder={t("login.email")}
                    className="width_15rem" />
                  <ErrorMessage name="email" component="div" className="alert alert-danger" />
                </div>
                <div className="center">
                  {/* Only show button/loader if not message */}
                  {!loading && !message && (
                    <button type="submit"
                      className="field width_15rem">
                      <span>{t("login.send_link")}</span>
                    </button>
                  )}
                  {loading && !message && (
                    <span className="loader"></span>
                  )}
                </div>
                {/* Show message only after loading is done */}
                {message && (
                  <div className="center" style={{ color: "red" }}>
                    {message}
                  </div>
                )}
              </Form>
            </Formik>
          </div>
        </div>
      </>
    );
  }
}

export default withTranslation("global")(RecoverPassword);
