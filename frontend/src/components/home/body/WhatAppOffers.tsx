import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Instagram from "../contact/instagram";

type Props = {
  t: any;
};

type State = {
  content: string;
  isModalOpen: boolean;
};

class WhatAppOffers extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: "",
      isModalOpen: false
    };
  }

  // componentDidMount() {
  //   UserService.getPublicContent().then(
  //     (response) => {
  //       this.setState({
  //         content: response.data
  //       });
  //     },
  //     (error: { response?: { data: string }; message?: string }) => {
  //       this.setState({
  //         content:
  //           (error.response && error.response.data) ||
  //           error.message ||
  //           "An error occurred"
  //       });
  //     }
  //   );
  // }

  render() {
    const { t } = this.props;

    const lineStyleBold: React.CSSProperties = {
      marginTop: "1.4rem",
      lineHeight: "1.6",
      fontSize: "1.1rem",
      color: "var(--color07)",
      maxWidth: "800px",
      textAlign: "center",
      letterSpacing: "1.05em",
    };

    const lineStyle: React.CSSProperties = {
      lineHeight: "1.6",
      fontSize: "1rem",
      color: "var(--color07)",
      maxWidth: "800px",
      textAlign: "center",
    };

    const buttonWrapperStyle: React.CSSProperties = {
      textAlign: "center",
      marginTop: "1.5rem",
    };

    return (
      <div className="card-container center">
        <div>
          <p style={lineStyleBold}>{t("home_page.user_01")}</p>
          <p style={lineStyle}>{t("home_page.user_02")}</p>
          <p style={lineStyle}>{t("home_page.user_03")}</p>
          <p style={lineStyle}>{t("home_page.user_04")}</p>
          <p style={lineStyle}>{t("home_page.user_05")}</p>
          <p style={lineStyle}>{t("home_page.user_06")}</p>

          <p style={lineStyleBold}>{t("home_page.trainer_01")}</p>
          <p style={lineStyle}>{t("home_page.trainer_02")}</p>
          <p style={lineStyle}>{t("home_page.trainer_03")}</p>
          <p style={lineStyle}>{t("home_page.trainer_04")}</p>
          <p style={lineStyle}>{t("home_page.trainer_05")}</p>
          <p style={lineStyle}>{t("home_page.trainer_06")}</p>

          <div style={buttonWrapperStyle}>
            <Instagram username="mateuszsmykal" />
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation("global")(WhatAppOffers);
