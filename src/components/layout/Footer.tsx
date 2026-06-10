import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 shadow-md flex-shrink-0">
            <div className="px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
                    {/* Left Section */}
                    <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left order-3 sm:order-1 w-full sm:w-auto">
                        <p>© {currentYear} Kenya Scouts. All rights reserved.</p>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap order-1 sm:order-2 w-full sm:w-auto">
                        <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-primary-600 transition-colors whitespace-nowrap">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-primary-600 transition-colors whitespace-nowrap">
                            Terms of Service
                        </a>
                        <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-primary-600 transition-colors whitespace-nowrap">
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
