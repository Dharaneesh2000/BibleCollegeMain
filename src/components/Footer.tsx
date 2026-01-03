const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'rgb(30, 28, 82)' }} className="text-white py-6" role="contentinfo" aria-label="Site footer">
      <div className="container-custom flex flex-col md:flex-row items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <img src="/images/Logo.png" alt="God's Will Bible College Logo" className="w-10 h-10" width="40" height="40" />
          <span className="font-bold text-lg">God's Will Bible College</span>
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-300">
          &copy; 2024 God's Will Bible College. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
