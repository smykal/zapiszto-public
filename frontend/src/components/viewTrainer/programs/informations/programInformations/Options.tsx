// ProgramOptions.tsx
import React, { useState } from "react";
import Modal from "../../../../../constants/Modal";
import { useTranslation } from "react-i18next";
import DuplicateProgram from "./DuplicateProgram";
import DeleteProgram from "./DeleteProgram";
import ChangeProgramName from "./ChangeProgramName";
import { Program } from "../../../../../types/types";

interface Props {
    program: Program;
    onDuplicateProgram: (id: string, newName: string) => void;
    onProgramDeleted: () => void;
    onSaveProgramName: (id: string, newName: string) => void;
}

const ProgramOptions: React.FC<Props> = ({ program, onDuplicateProgram, onProgramDeleted, onSaveProgramName }) => {
    const { t } = useTranslation("global");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const formatDate = (raw: string): string => {
        const date = new Date(raw);
        if (isNaN(date.getTime())) return raw;
        return date.toISOString().slice(0, 16).replace('T', ' ');
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <img
                src="/images/navigation/options.svg"
                alt={t("table.options")}
                style={{ cursor: "pointer", width: "24px", height: "24px" }}
                onClick={openModal}
            />
            <Modal show={isModalOpen} onClose={closeModal} title={t("table.options")}>
                <div className="field">
                                    {t('programs.created_date')}: &nbsp;{formatDate(program.createDate)}
                </div>

                <div className="field">
                    <ChangeProgramName
                        programId={program.id}
                        currentName={program.programName}
                        onSave={onSaveProgramName}
                    />
                </div>

                <div className="field">
                    <DuplicateProgram
                        programId={program.id}
                        onDuplicateProgram={onDuplicateProgram}
                        closeParentModal={closeModal}
                    />
                </div>
                <div className="field">
                    <DeleteProgram
                        program={program}
                        onProgramDeleted={() => {
                            onProgramDeleted();
                            closeModal();
                        }}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default ProgramOptions;
