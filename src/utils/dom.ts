import { useEffect } from 'preact/hooks'

function useIconFont() {
  const href = 'https://at.alicdn.com/t/font_1924427_4b37bvd5e4o.css'
  useEffect(() => {
    const linkElement = document.createElement('link')
    linkElement.setAttribute('rel', 'stylesheet')
    linkElement.setAttribute('href', href)
    document.querySelector('head')?.appendChild(linkElement)
    return () => {
      linkElement.remove()
    }
  }, [])
}

export { useIconFont }
