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
      localization={csCZ}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#4f46e5',
          colorBackground: '#09090b',
        },
        elements: {
          card: {
            // Změna: Místo černé dáme jemně fialový zářivý stín (ladí s tlačítkem)
            boxShadow: '0 0 40px -10px rgba(79, 70, 229, 0.2)', 
            // Světlejší a ostřejší okraj, aby to jasně oddělilo hrany
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }
        }
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);