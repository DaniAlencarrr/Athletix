export default function RunningPersonLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" viewBox="0 0 33 33">
      {/* Head */}
      <circle cx="18" cy="6" r="3" />

      {/* Body/torso - slightly angled for running motion */}
      <path d="M18 9L17 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Left arm - swinging back */}
      <path d="M17 12L12 10L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Right arm - swinging forward */}
      <path d="M17 12L22 14L24 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Left leg - extended back (pushing off) */}
      <path d="M17 20L14 25L11 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Right leg - lifted forward (in stride) */}
      <path d="M17 20L20 23L23 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Motion lines behind the runner to suggest speed */}
      <path
        d="M8 15L5 15M7 18L4 18M6 21L3 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />

      {/* Small ground indication */}
      <path d="M9 30L15 30" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.3" />
    </svg>
  )
}