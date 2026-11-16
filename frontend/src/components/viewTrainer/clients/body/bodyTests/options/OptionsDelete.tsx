import React from "react";
import { withTranslation } from "react-i18next";
import { useDeleteClientBodyTest } from "../../../../../../services/bodyTests/ClientBodyTestsTanstackService";

type Props = {
    testId: string;
    clientId: string;
    onTestOptionDelete: (testId: string) => void;
    closeModal: () => void;
    t: any;
};

const OptionsDelete: React.FC<Props> = ({ testId, clientId, onTestOptionDelete, closeModal, t }) => {
    const { mutateAsync: deleteClientBodyTest } = useDeleteClientBodyTest();

    const handleDelete = async () => {
        const confirmMsg = t("buttons.delete_confirm");

        if (window.confirm(confirmMsg)) {
            try {
                await deleteClientBodyTest({ id: testId, clientId });
                onTestOptionDelete(testId); // <- usunięcie z listy
                closeModal();
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    return (
        <div className="center">
            <button onClick={handleDelete} className="buttonDelete">
                {t("buttons.delete")}
            </button>
        </div>
    );
};

export default withTranslation("global")(OptionsDelete);
