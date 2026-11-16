import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MacrocycleService from '../../../../../services/macrocycle/Macrocycle';
import PeriodizationService from '../../../../../services/periodization/PeriodizationService';
import { MacrocycleDto, NewMacrocycleDto, PeriodizationDto } from '../../../../../types/types';
import Mesocycle from '../mesocycle/Mesocycle';

interface MakrocyklProps {
  programId: string;
}

const Makrocykl: React.FC<MakrocyklProps> = ({ programId }) => {
  const { t } = useTranslation('global');
  const [macrocycle, setMacrocycle] = useState<MacrocycleDto | null>(null);
  const [mesocycleTabIndex, setMesocycleTabIndex] = useState<number>(parseInt(localStorage.getItem(`macrocycle_${programId}_mesocycleTabIndex`) || '0'));
  const [periodizations, setPeriodizations] = useState<PeriodizationDto[]>([]);
  const [selectedPeriodization, setSelectedPeriodization] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [sessionsForMicrocycle, setSessionsForMicrocycle] = useState<number>(3);
  const [durationSession, setDurationSession] = useState<string>('60');
  const [durationSessionError, setDurationSessionError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchMacrocycle = async () => {
      try {
        const response = await MacrocycleService.getMacrocycle(programId);
        setMacrocycle(response.data);
      } catch (error) {
        console.error('Error fetching macrocycle:', error);
      }
    };

    const fetchPeriodizations = async () => {
      try {
        const response = await PeriodizationService.getPeriodizations();
        setPeriodizations(response.data);
      } catch (error) {
        console.error('Error fetching periodizations:', error);
      }
    };

    fetchMacrocycle();
    fetchPeriodizations();
  }, [programId]);

  useEffect(() => {
    localStorage.setItem(`macrocycle_${programId}_mesocycleTabIndex`, mesocycleTabIndex.toString());
  }, [mesocycleTabIndex, programId]);

  const handlePeriodizationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value;
    setSelectedPeriodization(selectedName);
    const selected = periodizations.find(p => p.name === selectedName);
    setDescription(selected ? selected.description : '');
  };

  const validateDurationSession = (value: string) => {
    if (!value.trim()) {
      return 'Wpisz liczbę z zakresu od 1 do 250.';
    }

    const numericValue = Number(value);

    if (!Number.isInteger(numericValue) || numericValue < 1 || numericValue > 250) {
      return 'Wpisz poprawną liczbę z zakresu od 1 do 250.';
    }

    return '';
  };

  const handleDurationSessionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDurationSession(value);
    setDurationSessionError(validateDurationSession(value));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nextDurationSessionError = validateDurationSession(durationSession);
    setDurationSessionError(nextDurationSessionError);

    if (nextDurationSessionError) {
      return;
    }

    const newMacrocycle: NewMacrocycleDto = {
      id: crypto.randomUUID(),
      programId: programId,
      duration: 4, // Fixed value 4
      mesocycleDuration: 4, // Fixed value 4
      periodization: selectedPeriodization,
      durationSession: Number(durationSession),
      sessionsForMicrocycle: sessionsForMicrocycle,
    };

    try {
      await MacrocycleService.addMacrocycle(newMacrocycle);
      setMacrocycle({
        id: newMacrocycle.id,
        programId: newMacrocycle.programId,
        duration: newMacrocycle.duration,
        durationLeft: newMacrocycle.duration * 4, // Assuming duration in weeks
      });
    } catch (error) {
      console.error('Error creating macrocycle:', error);
      setMessage(t('macrocycle.creation_error'));
    }
  };

  return (
    <div>
      {macrocycle ? (
        <div>
          {/* <div>
            <p>{t('macrocycle.duration')}: {macrocycle.duration}</p>
            <p>{t('macrocycle.duration_left')}: {macrocycle.durationLeft}</p>
          </div> */}
          <Mesocycle
            macrocycleId={macrocycle.id}
            initialDurationLeft={macrocycle.durationLeft}
            selectedTab={mesocycleTabIndex}
            onSelectTab={setMesocycleTabIndex}
          />
        </div>
      ) : (
        <div className='program-content'>
          <form onSubmit={handleSubmit}>
            <div >
              <label htmlFor="sessionsForMicrocycle" style={{ width: '220px', display: 'inline-block' }}>{t('macrocycle.sessions_per_microcycle')}</label>
              <select
                id="sessionsForMicrocycle"
                value={sessionsForMicrocycle}
                onChange={(e) => setSessionsForMicrocycle(Number(e.target.value))}
                className="field"
                style={{ width: '180px' }}
              >
                {[...Array(6)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="durationSession" style={{ width: '220px', display: 'inline-block' }}>{t('macrocycle.session_duration')}</label>
              <input
                id="durationSession"
                value={durationSession}
                onChange={handleDurationSessionChange}
                type="number"
                min={1}
                max={250}
                step={1}
                className="field"
                style={{ width: '180px' }}
              />
              {durationSessionError && <p style={{ color: 'crimson', marginTop: '4px' }}>{durationSessionError}</p>}
            </div>
            <div>
              <label htmlFor="periodization" style={{ width: '220px', display: 'inline-block' }}>{t('macrocycle.periodization')}</label>
              <select
                id="periodization"
                value={selectedPeriodization}
                onChange={handlePeriodizationChange}
                required
                className="field"
                style={{ width: '180px' }}
              >
                <option value="" disabled>{t('macrocycle.select_periodization')}</option>
                {periodizations.map((periodization) => (
                  <option key={periodization.name} value={periodization.name}>
                    {periodization.name}
                  </option>
                ))}
              </select>
              {description && <p style={{ width: '400px' }}> {description}</p>}
            </div>
            <button
              type="submit"
              className="field"
              disabled={!selectedPeriodization || !sessionsForMicrocycle || !durationSession || !!durationSessionError}
              style={{ marginLeft: '220px', width: '180px' }}
            >{t('macrocycle.add_button')}</button>
          </form>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>

  );
};

export default Makrocykl;