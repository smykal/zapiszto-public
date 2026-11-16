import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import { Invitation } from '../../../types/types';
import Service from '../../../services/invitations/';
import SingleInvitation from './SingleInvitation';
import ApproveInvitation from './ApproveInvitation';
import RejectInvitation from './RejectInvitation';
import Collapsible from 'react-collapsible';
import SendInvitation from "../invitations/SendInvitation";
type Props = {
    t: any
};

type State = {
    invitations: Invitation[];
    invitationsSent: Invitation[];
    invitationsRecived: Invitation[];
    invitationsAccepted: Invitation[];
    invitationsRejected: Invitation[];
};

class GetInvitations extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            invitations: [],
            invitationsSent: [],
            invitationsRecived: [],
            invitationsAccepted: [],
            invitationsRejected: []
        };
    }

    componentDidMount(): void {
        this.getInvitations();
    }

    getInvitations() {
        Service.getInvitations()
            .then(response => {
                const invitations = response.data;
                this.setState({
                    invitations,
                    invitationsSent: invitations.filter((invitation: Invitation) => invitation.status === 'SENT'),
                    invitationsRecived: invitations.filter((invitation: Invitation) => invitation.status === 'RECIVED'),
                    invitationsAccepted: invitations.filter((invitation: Invitation) => invitation.status === 'APPROVED'),
                    invitationsRejected: invitations.filter((invitation: Invitation) => invitation.status === 'REJECTED')
                });
            })
            .catch(error => {
                console.error('Błąd podczas pobierania zaproszeń:', error);
            });
    }

    render() {
        const { t } = this.props;
        const { invitationsSent, invitationsRecived, invitationsAccepted, invitationsRejected } = this.state;

        return (
            <div  className="width_15rem">
                <header>
                    <SendInvitation refreshInvitations={() => this.getInvitations()} />

                    <Collapsible
                        trigger={<div className="trigger-container">
                            <span>{t("invitations.title_sent")} </span>
                            <span>{invitationsSent.length}</span>
                        </div>}
                        open={false}
                    >
                        <ul className="invitation-list">
                            {invitationsSent.length > 0 ? (
                                invitationsSent.map(invitation => (
                                    <li key={invitation.id} className="invitation-item">
                                        <SingleInvitation invitation={invitation} />
                                    </li>
                                ))
                            ) : (
                                <li className="invitation-item-empty">{t("invitations.empty")}</li>
                            )}
                        </ul>
                    </Collapsible>

                    <Collapsible
                        trigger={<div className="trigger-container">
                            <span>{t("invitations.title_recived")} </span>
                            <span>{invitationsRecived.length}</span>
                        </div>}
                        open={false}
                    >
                        <ul className="invitation-list">
                            {invitationsRecived.length > 0 ? (
                                invitationsRecived.map(invitation => (
                                    <li key={invitation.id} className="invitation-item">
                                        <SingleInvitation invitation={invitation} />
                                        <ApproveInvitation invitation={invitation} refreshInvitations={() => this.getInvitations()} />
                                        <RejectInvitation invitation={invitation} refreshInvitations={() => this.getInvitations()} />
                                    </li>
                                ))
                            ) : (
                                <li className="invitation-item-empty">{t("invitations.empty")}</li>
                            )}
                        </ul>
                    </Collapsible>

                    <Collapsible
                        trigger={<div className="trigger-container">
                            <span>{t("invitations.title_approved")} </span>
                            <span>{invitationsAccepted.length}</span>
                        </div>}
                        open={false}
                    >
                        <ul className="invitation-list">
                            {invitationsAccepted.length > 0 ? (
                                invitationsAccepted.map(invitation => (
                                    <li key={invitation.id} className="invitation-item">
                                        <SingleInvitation invitation={invitation} />
                                    </li>
                                ))
                            ) : (
                                <li className="invitation-item-empty">{t("invitations.empty")}</li>
                            )}
                        </ul>
                    </Collapsible>

                    <Collapsible
                        trigger={<div className="trigger-container">
                            <span>{t("invitations.title_rejected")} </span>
                            <span>{invitationsRejected.length}</span>
                        </div>}
                        open={false}
                    >
                        <ul className="invitation-list">
                            {invitationsRejected.length > 0 ? (
                                invitationsRejected.map(invitation => (
                                    <li key={invitation.id} className="invitation-item">
                                        <SingleInvitation invitation={invitation} />
                                    </li>
                                ))
                            ) : (
                                <li className="invitation-item-empty">{t("invitations.empty")}</li>
                            )}
                        </ul>
                    </Collapsible>
                </header>
            </div>
        );
    }
}

export default withTranslation("global")(GetInvitations);