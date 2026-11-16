import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LANGUAGES } from "../../translations/Languages";
import { useTranslation } from "react-i18next";
import authHeader from "../../services/auth-header";
import { usePostLanguage } from "../../services/languages/LanguagesTanstackService";

export const LanguageMenu = () => {
  const { i18n, t } = useTranslation();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: postLanguage } = usePostLanguage();

  const normalizeLanguageCode = (languageCode: string) => {
    const baseCode = languageCode.toLowerCase().split('-')[0];
    return LANGUAGES.some(({ code }) => code === baseCode) ? baseCode : 'en';
  };

  const currentLanguageCode = useMemo(
    () => normalizeLanguageCode(localStorage.getItem('language') || i18n.language),
    [i18n.language]
  );

  const getFlagCode = (languageCode: string) => (languageCode === 'en' ? 'gb' : languageCode);

  const currentLanguage = LANGUAGES.find(({ code }) => code === currentLanguageCode) ?? LANGUAGES[0];

  const onChangeLang = async (lang_code: string) => {
    i18n.changeLanguage(lang_code);
    localStorage.setItem("language", lang_code);
    setIsOpen(false);


    // Check if the user is logged in
    if (authHeader()) {
      try {
        await postLanguage({ languageCode: lang_code });
      } catch (error) {
        console.error("Błąd podczas zmiany języka:", error);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      ref={menuRef}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-label={t('language.change_language') || 'Change language'}
        aria-expanded={isOpen}
        style={{
          width: '2.6rem',
          height: '2.6rem',
          minWidth: '0',
          minHeight: '0',
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          padding: 0,
          margin: 0,
          background: 'transparent',
          backgroundImage: 'none',
          cursor: 'pointer',
          overflow: 'hidden',
          lineHeight: 0,
          display: 'grid',
          placeItems: 'center',
          boxShadow: '0 0.35rem 0.9rem rgba(0, 0, 0, 0.18)',
        }}
      >
        <img
          src={`/images/flags/${getFlagCode(currentLanguage.code)}.png`}
          alt={currentLanguage.label}
          title={currentLanguage.label}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.6rem)',
            right: 0,
            zIndex: 50,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '11rem',
            padding: '0.7rem',
            borderRadius: '1rem',
            background: 'rgba(15, 18, 26, 0.96)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 1rem 2rem rgba(0, 0, 0, 0.3)',
          }}
        >
          {LANGUAGES.map(({ code, label }) => {
            const isCurrent = code === currentLanguage.code;

            return (
              <button
                key={code}
                type="button"
                onClick={() => onChangeLang(code)}
                aria-label={label}
                aria-pressed={isCurrent}
                title={label}
                style={{
                  width: '2.6rem',
                  height: '2.6rem',
                  flex: '0 0 2.6rem',
                  minWidth: '0',
                  minHeight: '0',
                  padding: 0,
                  margin: 0,
                  borderRadius: '50%',
                  border: isCurrent ? '2px solid #fff' : '2px solid transparent',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: 'transparent',
                  backgroundImage: 'none',
                  opacity: isCurrent ? 1 : 0.85,
                  transform: isCurrent ? 'scale(1.06)' : 'scale(1)',
                  lineHeight: 0,
                  transition: 'transform 0.15s ease, opacity 0.15s ease',
                }}
              >
                <img
                  src={`/images/flags/${getFlagCode(code)}.png`}
                  alt={label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};
