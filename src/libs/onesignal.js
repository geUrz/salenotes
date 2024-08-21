// utils/onesignal.js
export const initializeOneSignal = () => {
    if (typeof window !== 'undefined') {
      window.OneSignal = window.OneSignal || [];
      OneSignal.push(function() {
        OneSignal.init({
          appId: '8e1dbd58-5c05-4e25-b30b-526187be9374',
          notifyButton: {
            enable: true, // Habilita el botón de suscripción
          },
          allowLocalhostAsSecureOrigin: true, // Para desarrollo en localhost
        });
      });
    }
  };
  