import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PrivacyPolicyMarkdown from "../components/profile/privacy/PrivacyPolicyMarkdown";

type Props = {
  t: any;
};

class Privacy extends Component<Props> {
  render() {
    return (
      <PrivacyPolicyMarkdown />
    );
  }
}

export default withTranslation("privacy")(Privacy);