import React from 'react';
import { Copy, Check } from 'lucide-react';
import { Variation } from '../types';

interface ResultCardProps {
  variation: Variation;
  delay: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ variation, delay }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(variation.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 transition-all duration-700 ease-out hover:border-zinc-700 group"
      style={{ 
        animation: `fadeInUp 0.6s ease-out forwards`,
        animationDelay: `${delay}ms`,
        opacity: 0,
        transform: 'translateY(20px)'
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-zinc-400 text-sm font-medium tracking-wide uppercase">
          {variation.title}
        </h3>
        <button 
          onClick={handleCopy}
          className="text-zinc-500 hover:text-white transition-colors p-1"
          title="Zkopírovat"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      
      <p className="text-white text-lg leading-relaxed font-medium mb-4 whitespace-pre-wrap">
        {variation.content}
      </p>
      
      <div className="pt-4 border-t border-zinc-800">
        <p className="text-zinc-500 text-sm italic">
          "{variation.explanation}"
        </p>
      </div>
    </div>
  );
};