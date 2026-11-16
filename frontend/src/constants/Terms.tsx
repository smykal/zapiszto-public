import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import TermsOfServiceMarkdown from "../components/profile/terms/TermsOfServiceMarkdown";

type Props = {
    t: any;
};

class Terms extends Component<Props> {
    render() {
        return (
            <TermsOfServiceMarkdown />
        );
    }
}

export default withTranslation("terms")(Terms);

