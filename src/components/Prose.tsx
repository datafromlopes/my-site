import { useEffect, useRef } from 'react'
import { cn } from '@/lib/format'

/**
 * Renders build-time-compiled markdown. The only client-side work is attaching
 * a copy button to each code block once the HTML is in the DOM.
 */
export function Prose({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const blocks = root.querySelectorAll<HTMLPreElement>('pre')
    const cleanups: (() => void)[] = []

    blocks.forEach((pre) => {
      if (pre.dataset.enhanced === 'true') return
      pre.dataset.enhanced = 'true'
      pre.style.position = 'relative'

      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'md-copy'
      button.textContent = 'Copy'
      button.setAttribute('aria-label', 'Copy code')

      const onClick = async () => {
        const code = pre.querySelector('code')?.textContent ?? ''
        try {
          await navigator.clipboard.writeText(code)
          button.textContent = 'Copied'
          button.dataset.copied = 'true'
          setTimeout(() => {
            button.textContent = 'Copy'
            delete button.dataset.copied
          }, 1600)
        } catch {
          button.textContent = 'Failed'
          setTimeout(() => (button.textContent = 'Copy'), 1600)
        }
      }

      button.addEventListener('click', onClick)
      pre.appendChild(button)
      cleanups.push(() => button.removeEventListener('click', onClick))
    })

    return () => cleanups.forEach((fn) => fn())
  }, [html])

  return <div ref={ref} className={cn('prose-paper', className)} dangerouslySetInnerHTML={{ __html: html }} />
}
