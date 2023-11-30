import { useState } from 'react'
// import classes from './StoryPreview.module.css'
import ChevronLeftIcon from '../assets/chevron-left.svg'
import ChevronRightIcon from '../assets/chevron-right.svg'
import SendIcon from '../assets/send-icon.svg'
import CloseWhiteIcon from '../assets/close-white-icon.svg'
import BookmarkIcon from '../assets/bookmark-icon.svg'
import LikeIcon from '../assets/like-icon.svg'
import LikeFilledIcon from '../assets/like-filled-icon.svg'
import BookmarkFilledIcon from '../assets/bookmark-filled-icon.svg'
import SlidesProgressBar from './SlidesProgressBar'
import { useApp } from '../hooks/app'
import { useAuth } from '../hooks/auth'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import useSwr from 'swr'
import { getStoryLikesCount } from '../api/stories'
import { useEvent } from '../hooks/event'
import './StoryPreview.scoped.css'

function StoryPreview({
  story,
  onClose,
  handleLikeClick,
  handleBookmarkClick,
}) {
  const { user } = useAuth()
  const { openLoginModal } = useApp()

  const { mutate } = useSwr(
    `/story/${story._id}/likeCount`,
    () => getStoryLikesCount(story._id),
    {
      onSuccess: (data) => {
        setLikeCount(data.likeCount)
      },
    }
  )

  useEvent('refreshLike', () => mutate())

  const [likeCount, setLikeCount] = useState(undefined)

  const [activeSlideIndex, setActiveSlideIndex] = useState(0)

  const imageSrc = story.slides[activeSlideIndex].image
  const heading = story.slides[activeSlideIndex].heading
  const description = story.slides[activeSlideIndex].description
  const isLiked = !!story.isLiked
  const isBookmarked = !!story.isBookmarked
  const totalSlides = story.slides.length

  const [progessBarKey, setProgressBarKey] = useState(Date.now())

  function handleSlideIndexChange(idx) {
    setActiveSlideIndex(idx)
  }

  useEffect(() => {
    story.slides.forEach((slide) => {
      const img = new Image()
      img.src = slide.image
    })
  }, [story])

  function handleArrowClick(dir) {
    if (dir === 'left' && activeSlideIndex > 0) {
      setActiveSlideIndex((idx) => idx - 1)
      setProgressBarKey(Date.now())
    } else if (activeSlideIndex < totalSlides - 1) {
      setActiveSlideIndex((idx) => idx + 1)
      setProgressBarKey(Date.now())
    }
  }

  const onProgressComplete = () => {
    if (activeSlideIndex < totalSlides - 1) {
      setActiveSlideIndex((idx) => idx + 1)
      setProgressBarKey(Date.now())
    }
  }

  return (
    <div className="StoryPreviewLayout">
      <button className="ArrowButton" onClick={() => handleArrowClick('left')}>
        <img src={ChevronLeftIcon} alt="" />
      </button>
      <div className="StoryPreviewContainer">
        <img className="StoryPreviewImage" src={imageSrc} alt="foodStory" />
        <div>
          <SlidesProgressBar
            key={progessBarKey}
            slidesCount={story.slides.length}
            slideIndex={activeSlideIndex}
            onProgressComplete={onProgressComplete}
            onSlideIndexChange={handleSlideIndexChange}
          />
          <div className="StoryPreviewHeader">
            <button className="IconButton" onClick={onClose}>
              <img src={CloseWhiteIcon} alt="" />
            </button>
            <button
              className="IconButton"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)

                toast.error('Link copied to clipboard', {
                  position: 'bottom-center',
                  autoClose: 1000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: false,
                  progress: undefined,
                  theme: 'dark',
                })
              }}
            >
              <img src={SendIcon} alt="" />
            </button>
          </div>
        </div>
        <div>
          <div className="StoryPreviewContent">
            <p
              style={{
                fontSize: '28px',
                fontWeight: 700,
              }}
            >
              {heading}
            </p>
            <p>{description}</p>
          </div>
          <div className="StoryPreviewActions">
            <button
              className="IconButton"
              onClick={() => {
                if (!user) {
                  onClose()
                  openLoginModal()
                } else {
                  handleBookmarkClick()
                }
              }}
            >
              <img
                className="Icon"
                src={!isBookmarked ? BookmarkIcon : BookmarkFilledIcon}
                alt="BookmarkIcon"
              />
            </button>
            <div
              style={{
                display: 'flex',
              }}
            >
              <button
                className="IconButton"
                onClick={() => {
                  if (!user) {
                    onClose()
                    openLoginModal()
                  } else {
                    handleLikeClick()
                  }
                }}
              >
                <img
                  className="Icon"
                  src={!isLiked ? LikeIcon : LikeFilledIcon}
                  alt="LikeIcon"
                />
              </button>
              <p
                style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                {Number.isInteger(likeCount) ? likeCount : '...'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <button className="ArrowButton" onClick={() => handleArrowClick('right')}>
        <img src={ChevronRightIcon} alt="" />
      </button>
    </div>
  )
}

export default StoryPreview
