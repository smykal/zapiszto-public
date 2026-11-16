import React, { useEffect, useState } from 'react';
import CardService from '../../../services/card/CardService';
import { CardDto } from '../../../types/types';

import CardFieldTitle from './fields/CardFieldTitle';
import CardFieldDescription from './fields/CardFieldDescription';
import CardFieldExperience from './fields/CardFieldExperience';
import CardFieldPhone from './fields/CardFieldPhone';
import CardFieldMail from './fields/CardFieldMail';
import CardFieldInstagram from './fields/CardFieldInstagram';
import CardFieldWww from './fields/CardFieldWww';
import CardFieldOnline from './fields/CardFieldOnline';
import CardAddresses from './fields/CardAddresses/CardAddresses';
import CardPhotos from './fields/CardPhotos/CardPhotos';

interface Props {
  initialCard?: CardDto | null;
  onUpdated?: (card: CardDto) => void;
}

const emptyDraft = (): CardDto => ({
  id: '',
  title: '',
  description: '',
  experience: '',
  phone: '',
  mail: '',
  instagram: '',
  www: '',
  online: false
});

const CardEdit: React.FC<Props> = ({ initialCard = null, onUpdated }) => {
  const [card, setCard] = useState<CardDto>(emptyDraft());
  const [, setSavingField] = useState<string | null>(null);

  useEffect(() => {
    if (initialCard) setCard(initialCard);
  }, [initialCard]);

  const saveField = async (field: keyof CardDto, value: any) => {
    setSavingField(field as string);
    try {
      if (!card.id) {
        const createResp = await CardService.createCard({ ...card, [field]: value });
        if (createResp?.data?.id) {
          setCard(createResp.data);
          onUpdated && onUpdated(createResp.data);
          return;
        }
      }
      const resp = await CardService.patchCard(card.id, { [field]: value });
      if (resp?.data) {
        setCard(resp.data);
        onUpdated && onUpdated(resp.data);
      } else {
        const updated = { ...card, [field]: value };
        setCard(updated);
        onUpdated && onUpdated(updated);
      }
    } catch (error) {
      console.error('Error saving card field:', field, error);
    } finally {
      setSavingField(null);
    }
  };

  const handleChange = (field: keyof CardDto) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = (e.target.type === 'checkbox') ? (e.target as HTMLInputElement).checked : e.target.value;
    setCard(prev => ({ ...prev, [field]: value }));
    saveField(field, value);
  };

  return (

    <div className='card'>
      <div className='card-header'>
        <CardFieldTitle value={card.title} onChange={handleChange('title')} />
        <CardFieldMail value={card.mail} onChange={handleChange('mail')} />
        <CardFieldPhone value={card.phone} onChange={handleChange('phone')} />
        <CardFieldInstagram value={card.instagram} onChange={handleChange('instagram')} />
        <CardFieldWww value={card.www} onChange={handleChange('www')} />
      </div>
      <div className='card-grid'>
        <div>
          {/* left column: photos */}
          <CardPhotos cardId={card.id} />
        </div>
        {/* middle column: description and experience */}
        <div>
          <CardFieldDescription value={card.description} onChange={handleChange('description')} />
          <CardFieldExperience value={card.experience} onChange={handleChange('experience')} />
        </div>
        <div>
          {/* right column: addresses */}
          <CardAddresses cardId={card.id} />
          <CardFieldOnline checked={card.online} onChange={handleChange('online')} />
        </div>
      </div>
    </div>
  );
};

export default CardEdit;