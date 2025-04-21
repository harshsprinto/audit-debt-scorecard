
import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="w-full py-6 px-6 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Sprinto. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a 
              href="https://sprinto.com/privacy-policy" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-gray-500 hover:text-sprinto-orange transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="https://sprinto.com/terms" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-gray-500 hover:text-sprinto-orange transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
