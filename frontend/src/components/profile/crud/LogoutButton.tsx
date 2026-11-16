import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  logOut: () => void;
};

const LogoutButton: React.FC<Props> = ({ logOut }) => {
  const { t } = useTranslation('global');

  return (
      <button
        onClick={logOut}
        className="field purple width_15rem"
      >
      {t('navigation.log_out')}
      </button>
  );
};

export default LogoutButton;
