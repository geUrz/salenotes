// utils/onesignal.js
export const initializeOneSignal = () => {
    if (typeof window !== 'undefined') {
      window.OneSignal = window.OneSignal || [];
      OneSignal.push(function() {
        OneSignal.init({
          appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
          notifyButton: {
            enable: true, // Habilita el botón de suscripción
          },
          allowLocalhostAsSecureOrigin: true, // Para desarrollo en localhost
        });
      });
    }
  };
  