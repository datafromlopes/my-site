import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

/**
 * Tag filter backed by the `?tag=` query parameter, so a filtered view is a
 * shareable URL.
 *
 * The parameter is read in an effect rather than during render: the prerendered
 * HTML has no query string, so reading it synchronously would make the first
 * client render disagree with the server and break hydration.
 */
export function useTagFilter() {
  const [tag, setTag] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const value = new URLSearchParams(location.search).get('tag')
    setTag(value && value.trim() ? value : null)
  }, [location.search])

  const select = (next: string | null) => {
    const params = new URLSearchParams(location.search)
    if (next) params.set('tag', next)
    else params.delete('tag')
    const query = params.toString()
    navigate({ pathname: location.pathname, search: query ? `?${query}` : '' }, { replace: true })
  }

  return { tag, select }
}
