import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import { Invitation } from '../../../types/types';
import Service from '../../../services/invitations'

class ApproveInvitation extends Component<{ invitation: Invitation; t: any; refreshInvitations: () => void }> {
    handleApproveClick = () => {
        Service.postApproveInvitation(this.props.invitation)
            .then(() => this.props.refreshInvitations()) // Odświeżenie zaproszeń
            .catch(error => console.error('Błąd podczas akceptacji:', error));
    };

    render() {
        const { t } = this.props;
        return (
            <div>
                <button onClick={this.handleApproveClick}>{t('buttons.approve')}</button>
            </div>
        );
    }
}

export default withTranslation("global")(ApproveInvitation);
