import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { useGetGender } from "../../services/bodyParams/BodyParamsTanstackService";
import PostGender from "./postGender";
import Modal from "../../constants/Modal";
import Spinner from "../../common/Spinner";

type Props = {
  updateData: () => void;
};

const GetGender: React.FC<Props> = ({ updateData }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { t } = useTranslation("global");
  const { isLoading } = useGetGender();

  const refreshGender = () => {
    updateData();
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="center">
      <button
        className="width_15rem"
        onClick={() => setIsModalOpen(true)}
      >
        {t("buttons.update")}
      </button>
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} title={t("body_params.update_gender")}>
        <PostGender onGenderUpdate={refreshGender} />
      </Modal>
    </div>
  );
};

export default GetGender;
