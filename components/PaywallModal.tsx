import React from 'react';
import { Zap, CheckCircle, X } from 'lucide-react';
import { useUser, SignInButton } from '@clerk/clerk-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose }) => {
  // Vytáhneme si data a informaci, jestli je uživatel přihlášený
  const { user, isSignedIn } = useUser();

  if (!isOpen) return null;

  const handleStripeRedirect = () => {
    // Pokud je uživatel přihlášený, přidáme jeho ID rovnou do Stripe odkazu jako client_reference_id
    const userId = user?.id || '';
    const stripeLink = `https://buy.stripe.com/test_bJefZibT4fjo0td2sGdby00?client_reference_id=${userId}`;
    
    window.open(stripeLink, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop s blur efektem */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content - obal pro křížek a obsah */}
      <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-300">
        
        {/* ZAVÍRACÍ KŘÍŽEK - Vynesený ven z overflow-hidden pro jistotu zobrazení na iOS */}
        <button 
          onClick={onClose} 
          className="absolute -top-3 -right-3 sm:top-4 sm:right-4 z-[110] bg-zinc-900 sm:bg-transparent border-2 border-zinc-800 sm:border-transparent p-2 rounded-full sm:rounded-none text-zinc-400 hover:text-white transition-colors shadow-xl sm:shadow-none"
          aria-label="Zavřít"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>

        <div className="relative bg-zinc-950 border-2 border-zinc-800 rounded-3xl w-full p-8 sm:p-10 shadow-2xl overflow-hidden">
          
          {/* Glow efekt pro "Brutal" look */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/30 blur-[60px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(79,70,229,0.4)]">
              <Zap className="text-white fill-current" size={32} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black italic uppercase mb-3 tracking-tighter text-white">
              Munice došla.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mb-8 leading-relaxed">
              Tvoje 3 analýzy zdarma jsou pryč. Teď se musíš rozhodnout: buď se vrátíš k marketingu, který nikdo nečte, nebo si pořídíš editora, co ti nelže.
            </p>

            <div className="w-full space-y-4 mb-8 sm:mb-10 text-left bg-zinc-900/50 p-5 sm:p-6 rounded-2xl border border-zinc-800">
              {[
                "Neomezený počet analýz",
                "Pokročilé strategie (Story & Conflict)",
                "Žádný marketingový balast a klišé",
                "Zrušíš kdykoliv. Bez otázek."
              ].map((feature, i) => (
                <div key={i} className="flex items-center text-zinc-200 text-xs sm:text-sm font-medium">
                  <CheckCircle size={18} className="text-indigo-500 mr-3 shrink-0" />
                  {feature}
                </div>
              ))}
            </div>

            {/* Podmíněné zobrazení tlačítek podle stavu přihlášení */}
            {isSignedIn ? (
              <button 
                onClick={handleStripeRedirect}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm sm:text-base font-black py-4 sm:py-5 rounded-2xl uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] active:scale-95"
              >
                Odemknout PRO
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] sm:text-sm font-black py-4 sm:py-5 rounded-2xl uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)] active:scale-95">
                  Nejdřív se přihlas, pak zaplať
                </button>
              </SignInButton>
            )}
            
            <p className="mt-6 text-[9px] sm:text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold">
              Zabezpečeno přes Stripe • Klid v duši
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
