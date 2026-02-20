/// <reference types="vite/client" />
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';
import { csCZ } from '@clerk/localizations';
import { dark } from '@clerk/themes';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      localization={{
        ...csCZ,
        signUp: {
          start: {
            title: "Vytvořit účet",
            subtitle: "Zaregistrujte se a začněte tvořit brutální copy.",
            actionText: "Již máte účet?",
            actionLink: "Přihlásit se"
          }
        },
        signIn: {
          start: {
            title: "Přihlášení",
            subtitle: "Vítejte v aplikaci Brutal Copy.",
            actionText: "Nemáte ještě účet?",
            actionLink: "Zaregistrovat se"
          }
        }
      }}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#4f46e5', // Naše indigo-600
          colorBackground: '#09090b', // Extra tmavá pro sladění s webem
        }
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);