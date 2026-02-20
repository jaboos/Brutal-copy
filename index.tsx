/// <reference types="vite/client" />
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';
import { csCZ } from '@clerk/localizations'; // Zde je import naší češtiny

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* Tady posíláme češtinu do ClerkProvideru */}
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} localization={csCZ}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);