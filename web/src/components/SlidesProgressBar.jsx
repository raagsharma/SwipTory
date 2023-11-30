import { useRef, forwardRef } from 'react'
import './SlidesProgressBar.scoped.css'
import { useEffect } from 'react'

const ProgessBar = forwardRef(function ProgessBar(_, ref) {
  return (
    <div className="outer">
      <div className="inner" ref={ref}></div>
    </div>
  )
})

export default function SlidesProgressBar({
  slidesCount = 3,
  slideIndex = 0,
  onProgressComplete,
}) {
  // const [slidesProgress, setSlidesProgress] = useState(0)

  const eleRef = useRef([])

  useEffect(() => {
    const currentEle = eleRef.current[slideIndex]

    async function updateProgress() {
      for (let i = 0; i < slideIndex; i++) {
        eleRef.current[i].style.animationDuration = '0s'
        eleRef.current[i].style.animationPlayState = 'running'
      }

      currentEle.style.animationPlayState = 'running'
    }
    updateProgress()
    currentEle.addEventListener('animationend', onProgressComplete, false)
    return () => {
      currentEle.removeEventListener('animationend', onProgressComplete, false)
    }
  }, [slidesCount, slideIndex, onProgressComplete])

  return (
    <div className="container">
      {Array(slidesCount)
        .fill(0)
        .map((_, i) => (
          <ProgessBar key={i} ref={(el) => (eleRef.current[i] = el)} />
        ))}
    </div>
  )
}
