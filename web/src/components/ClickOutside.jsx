import { useRef, useEffect } from 'react'

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useClickOutside(ref, onClickOutside) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside()
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, onClickOutside])
}

/**
 * Component that alerts if you click outside of it
 */
function ClickOutside(props) {
  const wrapperRef = useRef(null)
  useClickOutside(wrapperRef, props.onClickOutside)

  return <div ref={wrapperRef}>{props.children}</div>
}

export default ClickOutside
