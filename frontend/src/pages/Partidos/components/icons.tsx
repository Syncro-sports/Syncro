export const CalendarIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4.5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M3 8H17" stroke="currentColor" strokeWidth="1.4" />
    <path d="M6.5 2.5V5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M13.5 2.5V5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const ClockIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10.5" r="7" stroke="currentColor" strokeWidth="1.4" />
    <path d="M10 6.5V10.5L12.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 2.5L12.35 7.26L17.6 8.02L13.8 11.72L14.7 16.95L10 14.48L5.3 16.95L6.2 11.72L2.4 8.02L7.65 7.26L10 2.5Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

export const HouseIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9L10 3L17 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 7.75V16.5H15.5V7.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 16.5V12H12V16.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="8" fill="currentColor" />
    <path d="M4.75 8.25L6.75 10.25L11.25 5.75" stroke="#05070B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LockIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3.5" y="8" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M5.75 8V5.5C5.75 3.84315 7.17893 2.5 9 2.5C10.8211 2.5 12.25 3.84315 12.25 5.5V8" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export const CardIcon = () => (
  <svg viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M1 5.5H19" stroke="currentColor" strokeWidth="1.4" />
    <path d="M4 10.5H8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const ExternalLinkIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.5 2.5H11.5V8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.5 2.5L2.5 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ShieldCheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 2.5L16.5 5V9.5C16.5 13.5 13.75 16.75 10 17.5C6.25 16.75 3.5 13.5 3.5 9.5V5L10 2.5Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path d="M7.25 10L9.25 12L12.75 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
