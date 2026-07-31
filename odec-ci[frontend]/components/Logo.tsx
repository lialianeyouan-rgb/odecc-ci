import React from "react";

const OFFICIAL_LOGO_SRC = "/logos/odec-logo.png";

const Logo: React.FC<{ className?: string }> = ({ className }) => (
  // The official site logo now uses the transparent PNG asset for consistent display on every background.
  <img
    src={OFFICIAL_LOGO_SRC}
    alt="ODEC-CI Logo"
    className={className}
  />
);

export default Logo;
