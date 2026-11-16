import React, { useState } from 'react';
import ExercisesSessionService from '../../../../../services/exercises/session/ExercisesSessionService';
import { CopyParametersDto } from '../../../../../types/types';
import { withTranslation } from "react-i18next";

interface CopyToNextDaySessionProps {
  t: any;
  sessionId: string;
  onClose: () => void;
  onCopied?: () => void;
}

const CopyToNextDaySession: React.FC<CopyToNextDaySessionProps> = ({t, onClose, sessionId, onCopied }) => {
  const [weightIncrease, setWeightIncrease] = useState<number>(0);
  const [weightIncreaseUnit, setWeightIncreaseUnit] = useState<string>('%');
  const [repetitions, setRepetitions] = useState<number>(0);

  const handleCopy = async () => {
    const copyParametersDto: CopyParametersDto = {
      weightIncrease: weightIncrease || 0,
      weightIncreaseUnit: weightIncreaseUnit || '%',
      repetitions: repetitions || 0,
    };

    try {
      await ExercisesSessionService.copyExercisesToNextDaySession(sessionId, copyParametersDto);
      if (onCopied) onCopied(); // <-- wywołaj po sukcesie
      onClose();
    } catch (error) {
      console.error('Error copying to next day session:', error);
    }
  };

  return (
    <div>
      <form>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <label style={{ flex: '1' }}>Weight Increase Unit:</label>
          <div style={{ flex: '2', display: 'flex', gap: '10px' }}>
            <label>
              <input
                type="radio"
                value="kg"
                checked={weightIncreaseUnit === 'kg'}
                onChange={(e) => setWeightIncreaseUnit(e.target.value)}
              />
              kg
            </label>
            <label>
              <input
                type="radio"
                value="%"
                checked={weightIncreaseUnit === '%'}
                onChange={(e) => setWeightIncreaseUnit(e.target.value)}
              />
              %
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <label style={{ flex: '1' }}>{t("buttons.increase_weight_by")}:</label>
          <input
            type="number"
            value={weightIncrease}
            style={{ flex: '2', padding: '5px' }}
            onChange={(e) => setWeightIncrease(Number(e.target.value))}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <label style={{ flex: '1' }}>{t("buttons.repetitions")}:</label>
          <input
            type="number"
            value={repetitions}
            style={{ flex: '2', padding: '5px' }}
            onChange={(e) => setRepetitions(Number(e.target.value))}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" onClick={handleCopy}>{t("buttons.copy")}</button>
          <button type="button" onClick={onClose}>{t("buttons.cancel")}</button>
        </div>
      </form>
    </div>
  );
};

export default withTranslation("global")(CopyToNextDaySession);
