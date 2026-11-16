import React from "react";
import { BodyParamsItem } from "../../../types/types";
import { useDeleteBodyParam } from "../../../services/bodyParams/BodyParamsTanstackService";

type Props = {
  item: BodyParamsItem;
  onDelete: (id: number) => void;
  closeModal: () => void;
  t: any;
};

const OptionsDelete: React.FC<Props> = ({ item, onDelete, closeModal, t }) => {
  const { mutateAsync: deleteBodyParam, isPending } = useDeleteBodyParam();

  const deleteItem = async () => {
    try {
      await deleteBodyParam(item.id);
      onDelete(item.id);
      closeModal();
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  return (
    <div>
      <button onClick={deleteItem} disabled={isPending} className="buttonDelete">
        {t("buttons.delete")}
      </button>
    </div>
  );
};

export default OptionsDelete;
