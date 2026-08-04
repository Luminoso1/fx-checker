export default function SwitchButton({ onSwitch }: { onSwitch: () => void }) {
  return (
    <button
      type="button"
      aria-label="switch base and quote currencies"
      onClick={onSwitch}
      className="size-12 rounded-lg cursor-pointer border border-neutral-500 bg-neutral-600 grid place-content-center"
    >
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        className="rotate-90 sm:rotate-0 transition-transform duration-300"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1"
        >
          <path d="M4 16h13m3-8H7"></path>
          <path strokeLinejoin="round" d="m8 12l-4 4l4 4m8-8l4-4l-4-4"></path>
        </g>
      </svg>
    </button>
  )
}
