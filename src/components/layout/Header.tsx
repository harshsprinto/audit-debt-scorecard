
import { FC } from 'react';

const Header: FC = () => {
  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/sprinto-logo.svg" 
            alt="Sprinto" 
            className="h-8"
            onError={(e) => {
              // Fallback text if logo isn't available
              e.currentTarget.outerHTML = '<span class="text-sprinto-orange font-bold text-2xl">Sprinto</span>';
            }}
          />
        </div>
        <div>
          <a 
            href="https://sprinto.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-600 hover:text-sprinto-orange transition-colors"
          >
            Visit Sprinto.com
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
