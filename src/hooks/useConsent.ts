import { useState, useEffect } from 'react';

const CONSENT_KEY = 'data_processing_consent';
const CONSENT_VERSION = '1.0';

interface ConsentState {
  hasConsent: boolean;
  isModalOpen: boolean;
  consentVersion: string | null;
}

export const useConsent = () => {
  const [consentState, setConsentState] = useState<ConsentState>({
    hasConsent: false,
    isModalOpen: false,
    consentVersion: null
  });

  useEffect(() => {
    // Check if user has given consent
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    const savedVersion = localStorage.getItem(`${CONSENT_KEY}_version`);
    
    if (savedConsent === 'true' && savedVersion === CONSENT_VERSION) {
      setConsentState({
        hasConsent: true,
        isModalOpen: false,
        consentVersion: savedVersion
      });
    } else {
      // Show modal if no consent or version mismatch
      setConsentState({
        hasConsent: false,
        isModalOpen: true,
        consentVersion: savedVersion
      });
    }
  }, []);

  const acceptConsent = () => {
    localStorage.setItem(CONSENT_KEY, 'true');
    localStorage.setItem(`${CONSENT_KEY}_version`, CONSENT_VERSION);
    
    setConsentState({
      hasConsent: true,
      isModalOpen: false,
      consentVersion: CONSENT_VERSION
    });

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('consentChanged', { 
      detail: { hasConsent: true } 
    }));
  };

  const declineConsent = () => {
    localStorage.setItem(CONSENT_KEY, 'false');
    localStorage.setItem(`${CONSENT_KEY}_version`, CONSENT_VERSION);
    
    setConsentState({
      hasConsent: false,
      isModalOpen: false,
      consentVersion: CONSENT_VERSION
    });

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('consentChanged', { 
      detail: { hasConsent: false } 
    }));
  };

  const requestConsent = () => {
    setConsentState(prev => ({
      ...prev,
      isModalOpen: true
    }));
  };

  const revokeConsent = () => {
    localStorage.removeItem(CONSENT_KEY);
    localStorage.removeItem(`${CONSENT_KEY}_version`);
    
    setConsentState({
      hasConsent: false,
      isModalOpen: false,
      consentVersion: null
    });
  };

  return {
    hasConsent: consentState.hasConsent,
    isModalOpen: consentState.isModalOpen,
    acceptConsent,
    declineConsent,
    requestConsent,
    revokeConsent
  };
};
