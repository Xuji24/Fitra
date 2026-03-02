"use client";
import { FooterLogo } from "@/components/logo";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Race", href: "#" },
    { name: "Activities", href: "#" },
  ];

  const supportLinks = [
    { name: "Contact", href: "#" },
    { name: "FAQ's", href: "#" },
  ];

  const socialLinks = [
    {
      label: "Instagram",
      icon: (
        <svg
          className="w-5 h-5 text-white"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.70975 7.93663C4.70975 6.65824 5.76102 5.62163 7.0582 5.62163C8.35537 5.62163 9.40721 6.65824 9.40721 7.93663C9.40721 9.21502 8.35537 10.2516 7.0582 10.2516C5.76102 10.2516 4.70975 9.21502 4.70975 7.93663ZM3.43991 7.93663C3.43991 9.90608 5.05982 11.5025 7.0582 11.5025C9.05658 11.5025 10.6765 9.90608 10.6765 7.93663C10.6765 5.96719 9.05658 4.37074 7.0582 4.37074C5.05982 4.37074 3.43991 5.96719 3.43991 7.93663ZM9.97414 4.22935C9.97408 4.39417 10.0236 4.55531 10.1165 4.69239C10.2093 4.82946 10.3413 4.93633 10.4958 4.99946C10.6503 5.06259 10.8203 5.07916 10.9844 5.04707C11.1484 5.01498 11.2991 4.93568 11.4174 4.81918C11.5357 4.70268 11.6163 4.55423 11.649 4.39259C11.6817 4.23095 11.665 4.06339 11.6011 3.91109C11.5371 3.7588 11.4288 3.6286 11.2898 3.53698C11.1508 3.44536 10.9873 3.39642 10.8201 3.39635H10.8197C10.5955 3.39646 10.3806 3.48424 10.222 3.64043C10.0635 3.79661 9.97434 4.00843 9.97414 4.22935ZM4.21142 13.5892C3.52442 13.5584 3.15101 13.4456 2.90286 13.3504C2.57387 13.2241 2.33914 13.0738 2.09235 12.8309C1.84555 12.588 1.69278 12.3569 1.56527 12.0327C1.46854 11.7882 1.3541 11.4201 1.32287 10.7431C1.28871 10.0111 1.28189 9.79119 1.28189 7.93669C1.28189 6.08219 1.28927 5.86291 1.32287 5.1303C1.35416 4.45324 1.46944 4.08585 1.56527 3.84069C1.69335 3.51647 1.84589 3.28513 2.09235 3.04191C2.3388 2.79869 2.57331 2.64813 2.90286 2.52247C3.1509 2.42713 3.52442 2.31435 4.21142 2.28358C4.95417 2.24991 5.17729 2.24319 7.0582 2.24319C8.9391 2.24319 9.16244 2.25047 9.90582 2.28358C10.5928 2.31441 10.9656 2.42802 11.2144 2.52247C11.5434 2.64813 11.7781 2.79902 12.0249 3.04191C12.2717 3.2848 12.4239 3.51647 12.552 3.84069C12.6487 4.08513 12.7631 4.45324 12.7944 5.1303C12.8285 5.86291 12.8354 6.08219 12.8354 7.93669C12.8354 9.79119 12.8285 10.0105 12.7944 10.7431C12.7631 11.4201 12.6481 11.7881 12.552 12.0327C12.4239 12.3569 12.2714 12.5882 12.0249 12.8309C11.7784 13.0736 11.5434 13.2241 11.2144 13.3504C10.9663 13.4457 10.5928 13.5585 9.90582 13.5892C9.16306 13.6229 8.93994 13.6296 7.0582 13.6296C5.17645 13.6296 4.95395 13.6229 4.21142 13.5892ZM4.15307 1.03424C3.40294 1.06791 2.89035 1.18513 2.4427 1.3568C1.9791 1.53408 1.58663 1.77191 1.19446 2.1578C0.802277 2.54369 0.56157 2.93108 0.381687 3.38797C0.207498 3.82941 0.0885535 4.3343 0.0543922 5.07358C0.0196672 5.81402 0.0117188 6.05074 0.0117188 7.93663C0.0117188 9.82252 0.0196672 10.0592 0.0543922 10.7997C0.0885535 11.539 0.207498 12.0439 0.381687 12.4853C0.56157 12.9419 0.802334 13.3297 1.19446 13.7155C1.58658 14.1012 1.9791 14.3387 2.4427 14.5165C2.89119 14.6881 3.40294 14.8054 4.15307 14.839C4.90479 14.8727 5.1446 14.8811 7.0582 14.8811C8.9718 14.8811 9.212 14.8732 9.96332 14.839C10.7135 14.8054 11.2258 14.6881 11.6737 14.5165C12.137 14.3387 12.5298 14.1014 12.9219 13.7155C13.3141 13.3296 13.5543 12.9419 13.7347 12.4853C13.9089 12.0439 14.0284 11.539 14.062 10.7997C14.0962 10.0587 14.1041 9.82252 14.1041 7.93663C14.1041 6.05074 14.0962 5.81402 14.062 5.07358C14.0278 4.33424 13.9089 3.82913 13.7347 3.38797C13.5543 2.93135 13.3135 2.5443 12.9219 2.1578C12.5304 1.7713 12.137 1.53408 11.6743 1.3568C11.2258 1.18513 10.7135 1.06735 9.96388 1.03424C9.21256 1.00058 8.97236 0.992188 7.05876 0.992188C5.14516 0.992188 4.90479 1.00002 4.15307 1.03424Z"
            fill="currentColor"
          />
        </svg>
      ),
      href: "#",
    },
    {
      label: "Facebook",
      icon: (
        <svg
          className="w-5 h-5 text-white"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.29921 19V10.6937H5.5V7.5H8.29921V5.475C8.29921 2.785 10.0274 1.2875 12.4602 1.2875C13.5892 1.2875 14.5561 1.3775 14.8649 1.4225V4.285H13.0011C11.5122 4.285 11.181 5.085 11.181 6.185V7.5H14.7262L14.2419 10.6937H11.181V19H8.29921Z"
            fill="currentColor"
          />
        </svg>
      ),
      href: "#",
    },
    {
      label: "TikTok",
      icon: (
        <svg
          className="w-5 h-5 text-white"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.4 2H14.6C14.4 1.6 14.1 1.3 13.6 1.3C12.9 1 12.4 1.4 12.4 2.1V10.2C12.4 11 11.8 11.7 10.9 11.7C9.9 11.7 9.1 10.9 9.1 9.9C9.1 8.9 9.9 8.1 10.9 8.1C11.1 8.1 11.3 8.2 11.5 8.2V5.5C11.2 5.4 10.9 5.4 10.6 5.4C8.2 5.4 6.2 7.4 6.2 9.9C6.2 12.4 8.2 14.3 10.6 14.3C13.1 14.3 15.1 12.3 15.1 9.9V6.1C16.2 6.9 17.5 7.4 18.9 7.4V4.7C18.4 4.8 17.9 4.8 17.4 4.7V2Z"
            fill="currentColor"
          />
        </svg>
      ),
      href: "#",
    },
    {
      label: "X",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="text-white"
        >
          <g id="Social Media">
            <path
              id="Vector"
              d="M11.3214 8.93666L16.4919 3.05566H15.2667L10.7772 8.16205L7.1914 3.05566H3.05566L8.47803 10.7774L3.05566 16.9446H4.28097L9.022 11.552L12.8088 16.9446H16.9446L11.3211 8.93666H11.3214ZM9.64322 10.8455L9.09382 10.0765L4.72246 3.95821H6.60445L10.1322 8.8959L10.6816 9.66481L15.2672 16.083H13.3852L9.64322 10.8458V10.8455Z"
              fill="currentColor"
            />
          </g>
        </svg>
      ),
      href: "#",
    },
  ];

  return (
    <footer className="w-full bg-[#193C43]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-2 md-grid-rows-2 gap-12 py-12 md:py-16">
          {/* Logo and Description Section - Left Side */}
          <div className="col-span-1 p-0">
            <div className="mb-4">
              <FooterLogo />
            </div>
            <div className="max-w-md">
              <p className="text-white text-sm leading-relaxed mb-6">
                Be Fit ERA encourages people to join running community, to keep
                healthy and make the most out of running. By achieving goals
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  className="w-8 h-8 flex justify-center items-center hover:opacity-80 transition-opacity"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right Side - Links Grid */}
          <div className="col-span-1 grid grid-cols-3 gap-8">
            {/* Quick Links */}
            <div className="col-span-1">
              <h4 className="text-white font-semibold mb-4 text-base">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-white text-sm hover:text-[#33CCB3] transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="col-span-1">
              <h4 className="text-white font-semibold mb-4 text-base">
                Support
              </h4>
              <ul className="space-y-3">
                {supportLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-white text-sm hover:text-[#33CCB3] transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links Column */}
            <div className="col-span-1">
              <h4 className="text-white font-semibold mb-4 text-base">
                Social
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-white text-sm hover:text-[#33CCB3] transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white text-sm hover:text-[#33CCB3] transition-colors"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white text-sm hover:text-[#33CCB3] transition-colors"
                  >
                    TikTok
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white text-sm hover:text-[#33CCB3] transition-colors"
                  >
                    X
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white opacity-20"></div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-white text-sm text-center md:text-left">
            © 2026 Be Fit ERA. All rights reserved
          </span>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-white text-sm hover:text-[#33CCB3] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-white text-sm hover:text-[#33CCB3] transition-colors"
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
