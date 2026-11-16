import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import { Invitation } from '../../../types/types';
import Service from '../../../services/invitations'

class RejectInvitation extends Component<{ invitation: Invitation; t: any; refreshInvitations: () => void }> {
    handleRejectClick = () => {
        Service.postRejectInvitation(this.props.invitation)
            .then(() => this.props.refreshInvitations()) // Odświeżenie zaproszeń
            .catch(error => console.error('Błąd podczas odrzucania:', error));
    };

    render() {
        const { t } = this.props;
        return (
            <div>
                <button onClick={this.handleRejectClick}>{t('buttons.reject')}</button>
            </div>
        );
    }
}

export default withTranslation("global")(RejectInvitation);
