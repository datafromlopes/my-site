import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

/** Stroke icons on a 24px grid — inline so nothing loads from a CDN. */
function Stroke({ size = 16, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

function Solid({ size = 16, children, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
      {children}
    </svg>
  )
}

export const ArrowRight = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Stroke>
)

export const ArrowUpRight = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Stroke>
)

export const ArrowLeft = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </Stroke>
)

export const Search = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Stroke>
)

export const Sun = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Stroke>
)

export const Moon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </Stroke>
)

export const Monitor = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="2.5" y="4" width="19" height="13" rx="1.5" />
    <path d="M8 21h8M12 17v4" />
  </Stroke>
)

export const Copy = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </Stroke>
)

export const Check = (p: IconProps) => (
  <Stroke {...p}>
    <path d="m4 12.5 5 5L20 6.5" />
  </Stroke>
)

export const Close = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Stroke>
)

export const Menu = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Stroke>
)

export const Mail = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Stroke>
)

export const Pin = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Stroke>
)

export const Calendar = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Stroke>
)

export const Clock = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.2l3.2 2" />
  </Stroke>
)

export const Document = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
    <path d="M14 3v5h5M9 13h6M9 17h4" />
  </Stroke>
)

export const Quote = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M9 6C6.5 7.5 5 10 5 13v5h5v-6H7.5c0-2 .8-3.6 2.4-4.6ZM19 6c-2.5 1.5-4 4-4 7v5h5v-6h-2.5c0-2 .8-3.6 2.4-4.6Z" />
  </Stroke>
)

export const Download = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M12 3v12M7.5 10.5 12 15l4.5-4.5M4 20h16" />
  </Stroke>
)

export const Printer = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M7 9V3h10v6M7 19H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
    <rect x="7" y="15" width="10" height="6" rx="1" />
  </Stroke>
)

export const Database = (p: IconProps) => (
  <Stroke {...p}>
    <ellipse cx="12" cy="6" rx="8" ry="3" />
    <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
  </Stroke>
)

export const Brain = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M12 5a3 3 0 0 0-5.9-.7A3 3 0 0 0 4 9.5a3 3 0 0 0 .6 4.6A3 3 0 0 0 8 19a3 3 0 0 0 4 .9Z" />
    <path d="M12 5a3 3 0 0 1 5.9-.7A3 3 0 0 1 20 9.5a3 3 0 0 1-.6 4.6A3 3 0 0 1 16 19a3 3 0 0 1-4 .9ZM12 5v15" />
  </Stroke>
)

export const Cpu = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="6" y="6" width="12" height="12" rx="1.5" />
    <rect x="10" y="10" width="4" height="4" rx=".5" />
    <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
  </Stroke>
)

export const Hash = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M5 9h14M5 15h14M10 3 8 21M16 3l-2 18" />
  </Stroke>
)

export const Rss = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" />
    <circle cx="5" cy="19" r="1.6" fill="currentColor" stroke="none" />
  </Stroke>
)

export const Command = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M6 3a3 3 0 1 1-3 3h12a3 3 0 1 1 3-3M6 21a3 3 0 1 0-3-3h12a3 3 0 1 0 3 3" />
  </Stroke>
)

export const GitHub = (p: IconProps) => (
  <Solid {...p}>
    <path d="M12 1.5A10.5 10.5 0 0 0 8.7 22c.5.1.7-.2.7-.5v-2c-2.9.6-3.5-1.3-3.5-1.3-.5-1.2-1.2-1.5-1.2-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.4-2.3-.3-4.8-1.2-4.8-5.2 0-1.2.4-2.1 1.1-2.9-.1-.3-.5-1.4.1-2.8 0 0 .9-.3 2.9 1.1a10 10 0 0 1 5.3 0c2-1.4 2.9-1.1 2.9-1.1.6 1.4.2 2.5.1 2.8.7.8 1.1 1.7 1.1 2.9 0 4-2.5 4.9-4.8 5.2.4.3.7 1 .7 2v3c0 .3.2.6.7.5A10.5 10.5 0 0 0 12 1.5Z" />
  </Solid>
)

export const LinkedIn = (p: IconProps) => (
  <Solid {...p}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05C21.6 8.65 23 10.6 23 14.1V21h-4v-6.1c0-1.5-.03-3.4-2.1-3.4-2.1 0-2.4 1.6-2.4 3.3V21h-4V9Z" />
  </Solid>
)

export const XLogo = (p: IconProps) => (
  <Solid {...p}>
    <path d="M17.5 3h3.2l-7 8 8.2 10h-6.4l-5-6.1L4.8 21H1.6l7.5-8.6L1.2 3h6.6l4.5 5.6L17.5 3Zm-1.1 16.1h1.8L7.7 4.8H5.8l10.6 14.3Z" />
  </Solid>
)

export const Bluesky = (p: IconProps) => (
  <Solid {...p}>
    <path d="M5.8 3.9C8.4 5.9 11.2 9.8 12 12c.8-2.2 3.6-6.1 6.2-8.1 1.9-1.4 4.8-2.5 4.8.9 0 .7-.4 5.6-.6 6.4-.8 2.8-3.6 3.5-6.1 3 4.4.8 5.5 3.2 3.1 5.7-4.6 4.7-6.6-1.2-7.1-2.7-.1-.3-.2-.4-.2-.3 0-.1-.1 0-.2.3-.5 1.5-2.5 7.4-7.1 2.7-2.4-2.5-1.3-4.9 3.1-5.7-2.5.5-5.3-.2-6.1-3-.2-.8-.6-5.7-.6-6.4 0-3.4 2.9-2.3 4.8-.9Z" />
  </Solid>
)

export const Orcid = (p: IconProps) => (
  <Solid {...p}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM8.2 16.7H6.8V9.4h1.4v7.3Zm-.7-8.3a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Zm4.7 8.3h-2.5V9.4h2.7c2.5 0 3.9 1.6 3.9 3.6 0 2.2-1.6 3.7-4.1 3.7Zm.1-6.1h-1.2v4.9h1.1c1.7 0 2.6-1 2.6-2.5 0-1.4-.8-2.4-2.5-2.4Z" />
  </Solid>
)

export const Lattes = (p: IconProps) => (
  <Solid {...p}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 3.5c3.6 0 6.5 2.9 6.5 6.5S15.6 18.5 12 18.5 5.5 15.6 5.5 12c0-1.2.3-2.3.9-3.3l2.2 1.4A4 4 0 0 0 8 12a4 4 0 1 0 4-4c-.7 0-1.4.2-2 .5L8.6 6.3c1-.5 2.2-.8 3.4-.8Z" />
  </Solid>
)

export const HuggingFace = (p: IconProps) => (
  <Solid {...p}>
    {/* Face plus the two raised hands that make the mark readable at 16px. */}
    <path d="M12 3.2a7.6 7.6 0 0 0-6.6 11.35 2.4 2.4 0 0 0-1.2-.35c-1 0-1.7.75-1.7 1.6 0 .5.2.95.6 1.35l2.2 2.2c1.5 1.4 3.5 2.15 5.6 2.15h2.2c2.1 0 4.1-.75 5.6-2.15l2.2-2.2c.4-.4.6-.85.6-1.35 0-.85-.7-1.6-1.7-1.6-.42 0-.83.12-1.2.35A7.6 7.6 0 0 0 12 3.2Zm0 1.6a6 6 0 1 1 0 12 6 6 0 0 1 0-12ZM9.5 8.6a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM8.6 12.4a.6.6 0 0 0-.55.85c.66 1.45 2.1 2.35 3.95 2.35s3.29-.9 3.95-2.35a.6.6 0 0 0-.72-.82c-.98.33-2.09.5-3.23.5s-2.25-.17-3.23-.5a.6.6 0 0 0-.17-.03Z" />
  </Solid>
)

export const Sparkle = (p: IconProps) => (
  <Solid {...p}>
    <path d="M12 2.5 13.8 9l6.5 1.8-6.5 1.8L12 19.1l-1.8-6.5L3.7 10.8 10.2 9 12 2.5Z" />
  </Solid>
)

export const iconFor: Record<string, (p: IconProps) => React.ReactElement> = {
  linkedin: LinkedIn,
  github: GitHub,
  huggingface: HuggingFace,
  bluesky: Bluesky,
  x: XLogo,
  orcid: Orcid,
  lattes: Lattes,
  email: Mail,
  rss: Rss,
}
