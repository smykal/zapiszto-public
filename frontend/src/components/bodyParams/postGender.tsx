import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePostSex } from "../../services/bodyParams/BodyParamsTanstackService";

type PostGenderProps = {
  onGenderUpdate: () => void;
};

const PostGender: React.FC<PostGenderProps> = ({ onGenderUpdate }) => {
  const [gender, setGender] = useState<string>("");
  const { t } = useTranslation("global");
  const { mutateAsync: postSex, isPending } = usePostSex();

  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (gender) {
      try {
        await postSex(gender);
        onGenderUpdate();
      } catch (error) {
        console.error("Error updating gender:", error);
      }
    }
  };

  return (
    <div className="center">
      <form onSubmit={handleSubmit}>
        <select value={gender} onChange={handleGenderChange} className="field">
          <option value="" disabled hidden>{t("buttons.select_gender")}</option>
          <option value="Male">{t("buttons.male")}</option>
          <option value="Female">{t("buttons.female")}</option>
        </select>
        <button type="submit" className="field width_15rem" disabled={isPending}>
          {t("buttons.add")}
        </button>
      </form>
    </div>
  );
};

export default PostGender;
