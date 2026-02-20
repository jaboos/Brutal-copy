import React from 'react';

export const AnalysisLoader: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 relative">
      
      {/* Centrální High-Tech Loader - Kybernetický skener */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative w-32 h-32">
          {/* Vnější rotující prstenec */}
          <div className="absolute inset-0 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          {/* Vnitřní protiběžný prstenec */}
          <div className="absolute inset-3 border-4 border-zinc-800 border-b-indigo-400 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
          {/* Pulzující střed */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-indigo-500 rounded-full animate-ping"></div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <h3 className="text-indigo-400 font-black italic uppercase tracking-[0.3em] text-base animate-pulse">
            Probíhá analýza
          </h3>

        </div>
      </div>

      {/* Původní Skeletony s jemným blurem */}
      <div className="space-y-8 opacity-40 blur-[2px] pointer-events-none">
        {/* Horní sekce: Skóre a Verdikt */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-zinc-900/30 border border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center h-48">
            <div className="w-12 h-4 bg-zinc-800 rounded animate-pulse mb-4"></div>
            <div className="w-20 h-16 bg-zinc-800 rounded-lg animate-pulse"></div>
          </div>
          <div className="md:col-span-2 bg-zinc-900/30 border border-zinc-800 rounded-xl p-8 flex flex-col justify-center h-48">
            <div className="w-24 h-4 bg-zinc-800 rounded animate-pulse mb-4"></div>
            <div className="space-y-3">
              <div className="w-full h-4 bg-zinc-800 rounded animate-pulse"></div>
              <div className="w-5/6 h-4 bg-zinc-800 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Spodní sekce: Varianty */}
        <div>
          <div className="w-48 h-6 bg-zinc-800 rounded animate-pulse mb-6"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 h-64 space-y-4">
                <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-zinc-800 rounded animate-pulse"></div>
                  <div className="w-full h-3 bg-zinc-800 rounded animate-pulse"></div>
                  <div className="w-3/4 h-3 bg-zinc-800 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};