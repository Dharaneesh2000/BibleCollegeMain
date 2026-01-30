const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'rgb(30, 28, 82)' }} className="text-white py-4 sm:py-6" role="contentinfo" aria-label="Site footer">
      <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <img src="/images/Logo.png" alt="God's Will Bible College Logo" className="w-8 h-8 sm:w-10 sm:h-10" width="40" height="40" />
          <span className="font-bold text-base sm:text-lg">God's Will Bible College</span>
        </div>

        {/* Copyright */}
        <div className="text-xs sm:text-sm text-gray-300 text-center sm:text-left">
          &copy; 2024 God's Will Bible College. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
