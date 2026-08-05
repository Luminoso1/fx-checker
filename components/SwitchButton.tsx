import { Button } from '@/components/ui/button'
import { Arrows } from '@/components/icons/arrow'

export default function SwitchButton({ onSwitch }: { onSwitch: () => void }) {
  return (
    <Button
      aria-label="switch base and quote currencies"
      onClick={onSwitch}
      className="size-12 border border-neutral-500 bg-neutral-600 grid place-content-center"
    >
      <Arrows className="rotate-90 sm:rotate-0 transition-transform duration-300" />
    </Button>
  )
}
