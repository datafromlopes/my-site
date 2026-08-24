import { useScrollProgress } from '@/lib/hooks'

/** Hairline progress bar pinned under the header on article pages. */
export function ReadingProgress() {
  const progress = useScrollProgress()

  return (
    <div className="no-print fixed inset-x-0 top-0 z-[60] h-px" aria-hidden="true">
      <div
        className="h-full origin-left bg-accent transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}
