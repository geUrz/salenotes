// lib/onesignal.js
import { useEffect } from 'react';

const initOneSignal = () => {
  // Código de inicialización que usa `window`
  if (typeof window !== 'undefined') {
    // Aquí puedes usar el código que depende del objeto `window`
    const OneSignal = window.OneSignal || [];
    
    OneSignal.push(function() {
      OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        allowLocalhostAsSecureOrigin: true,
      });

      OneSignal.on('notificationDisplay', function(event) {
        console.log('Notification displayed:', event);
      });

      OneSignal.on('notificationDismiss', function(event) {
        console.log('Notification dismissed:', event);
      });
    });
  }
};

export default initOneSignal;
