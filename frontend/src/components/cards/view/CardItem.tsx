import React from 'react';
import AuthService from '../../../services/auth.service';
import IUser from '../../../types/user.type';
import { CardViewDto } from '../../../types/types';
import CardPhotosView from './CardPhotosView';
import CardTitleView from './CardTitleView';
import CardContactView from './CardContactView';
import CardAddressesView from './CardAddressesView';
import CardOnlineView from './CardOnlineView';
import CardDescriptionExperienceView from './CardDescriptionExperienceView';
import CardOptions from './options/CardOptions';

interface Props {
  card: CardViewDto;
  onRefresh?: () => void;
}

const CardItem: React.FC<Props> = ({ card, onRefresh }) => {
  const [currentUser, setCurrentUser] = React.useState<IUser | null>(null);

  React.useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const hasRole = (role: string): boolean => {
    return currentUser?.roles?.includes(role) ?? false;
  };

  return (
    <div className="card" style={{ padding: 12 }}>
      <div className="card-header">
        <CardTitleView value={card.title} />
        <CardContactView
          mail={card.mail}
          www={card.www}
          phone={card.phone}
          instagram={card.instagram}
        />
      </div>

      <div className="card-grid" style={{ marginTop: 12 }}>
        {/* KOLUMNA 1: Zdjęcia */}
        <div>
          <CardPhotosView photos={card.photos ?? []} />
        </div>

        {/* KOLUMNA 2: Tytuł i główne informacje */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <CardDescriptionExperienceView
            description={card.description}
            experience={card.experience}
          />
        </div>

        {/* KOLUMNA 3: Adresy */}
        <div>
          <CardAddressesView addresses={card.addresses ?? []} />
          <CardOnlineView online={card.online} />
        </div>
      </div>

      {/* CardOptions dla admina — pod kartą */}
      {hasRole('ROLE_ADMIN') && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color07)' }}>
          <CardOptions cardId={card.id} onRefresh={onRefresh ?? (() => {})} />
        </div>
      )}
    </div>
  );
};

export default CardItem;