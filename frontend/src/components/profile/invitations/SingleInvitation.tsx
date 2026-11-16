import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import { Invitation } from '../../../types/types';

type Props = {
    invitation: Invitation;
    t: any;
};

class SingleInvitation extends Component<Props> {
    render() {
        const { invitation, t } = this.props;
        return (
            <div className="single-invitation">
                <div>
                    <p>{t("invitations.from")}: {invitation.inviterName} ({invitation.inviterEmail})</p>
                    <p>{t("invitations.to")}: {invitation.inviteeName} ({invitation.inviteeEmail})</p>
                </div>
            </div>
        );
    }
}

export default withTranslation("global")(SingleInvitation);