import React from "react";

export const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-[#1877F2]"
  >
    <path d="M24 12.073C24 5.445 18.532 0 12 0C5.468 0 0 5.445 0 12.073C0 18.75 5.468 24 12 24C18.532 24 24 18.75 24 12.073ZM12 2C16.418 2 20 5.582 20 10C20 14.418 16.418 18 12 18C7.582 18 4 14.418 4 10C4 5.582 7.582 2 12 2ZM13.5 15.5H10.5V12H13.5V15.5ZM13.5 9.5H10.5C8.343 9.5 6.5 11.343 6.5 13.5C6.5 15.657 8.343 17.5 10.5 17.5H13.5V13.5H10.5V13.5Z" />
  </svg>
);

export const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-pink-500"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <circle cx="17.5" cy="6.5" r="1.5"></circle>
  </svg>
);

// On exporte aussi un objet pour faciliter la boucle dans SocialSettings
export const SOCIAL_ICONS_MAP = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
};
