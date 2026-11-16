import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import OptionsDelete from "./OptionsDelete";
import OptionsEdit from "./OptionsEdit";
import { ClientBodyTest } from "../../../../../../types/types";
import Modal from "../../../../../../constants/Modal";

type Props = {
  test: ClientBodyTest;
  clientId: string;
  onTestOptionEdit: (updatedTest: ClientBodyTest) => void;
  onTestOptionDelete: (testId: string) => void;
  t: any;
};

type State = {
  isModalOpen: boolean;
  isEditModalOpen: boolean;
  testData?: ClientBodyTest;
};

class Options extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isModalOpen: false,
      isEditModalOpen: false,
      testData: undefined,
    };
  }

  openMainModal = () => {
    this.setState({ isModalOpen: true });
  };

  closeMainModal = () => {
    this.setState({ isModalOpen: false });
  };

  openEditModal = () => {
  this.setState({
    testData: this.props.test,
    isEditModalOpen: true,
  });
};

  closeEditModal = () => {
    this.setState({ isEditModalOpen: false });
  };

  handleUpdated = (updated: ClientBodyTest) => {
    this.props.onTestOptionEdit(updated);
    this.closeEditModal();
    this.closeMainModal();
  };

  render() {
    const { test, clientId, onTestOptionDelete, t } = this.props;
    const { isModalOpen, isEditModalOpen, testData } = this.state;

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/images/navigation/options.svg"
          alt={t("table.options")}
          style={{ cursor: "pointer", width: "24px", height: "24px" }}
          onClick={this.openMainModal}
        />

        <Modal show={isModalOpen} onClose={this.closeMainModal} title={t("table.options")}>
          <div className="center">
            <button onClick={this.openEditModal} className="buttonEdit">
              {t("buttons.edit")}
            </button>
          </div>
          <OptionsDelete
            testId={test.id}
            clientId={clientId}
            onTestOptionDelete={onTestOptionDelete}
            closeModal={this.closeMainModal}
          />
        </Modal>

        {isEditModalOpen && testData && (
          <OptionsEdit
            test={testData}
            clientId={clientId}
            onUpdated={this.handleUpdated}
            onClose={this.closeEditModal}
          />
        )}
      </div>
    );
  }
}

export default withTranslation("global")(Options);
