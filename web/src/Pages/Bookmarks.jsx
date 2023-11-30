import useSWR from 'swr'
import { getBookmarkedStories } from '../api/stories'
import { useCallback, useEffect, useState } from 'react'
import Modal from 'react-modal'
import {
  likeStory,
  unlikeStory,
  bookmarkStory,
  unbookmarkStory,
} from '../api/stories'
import NavBar from '../components/NavBar'
import StoryPreview from '../components/StoryPreview'
import StorySection from '../components/StorySection'
import { useAuth } from '../hooks/auth'
import { useNavigate } from 'react-router-dom'
import { useEventDispatch } from '../hooks/event'

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: 0,
    border: 'none',
    borderRadius: '0px',
    backgroundColor: 'transparent',
    outline: 'none',
  },
}

function Bookmarks() {
  const { isLoading, mutate, data } = useSWR(
    '/story/bookmarked',
    getBookmarkedStories
  )

  const [activeStory, setActiveStory] = useState(undefined)

  const onStoryClick = useCallback((story) => {
    window.history.pushState('', '', `/story/${story._id}`)
    setActiveStory(story)
  }, [])

  const dispatchEvent = useEventDispatch()

  async function handleLikeClick() {
    const storyId = activeStory._id
    const currentLike = !!activeStory.isLiked
    try {
      setActiveStory((prev) => ({
        ...prev,
        isLiked: !currentLike,
      }))

      currentLike ? await unlikeStory(storyId) : await likeStory(storyId)
      dispatchEvent('refreshLike', {})
    } catch (error) {
      setActiveStory((prev) => ({
        ...prev,
        isLiked: currentLike,
      }))
    }
  }

  async function handleBookmarkClick() {
    const storyId = activeStory._id
    const currentBookmark = !!activeStory.isBookmarked
    try {
      setActiveStory((prev) => ({
        ...prev,
        isBookmarked: !currentBookmark,
      }))

      currentBookmark
        ? await unbookmarkStory(storyId)
        : await bookmarkStory(storyId)
    } catch (error) {
      setActiveStory((prev) => ({
        ...prev,
        isBookmarked: currentBookmark,
      }))
    }
  }

  function handleClose() {
    mutate()
    setActiveStory(undefined)
    window.history.pushState('', '', `/bookmarks`)
  }

  return (
    <>
      <NavBar></NavBar>
      <main
        style={{
          padding: '2rem 3rem',
        }}
      >
        {isLoading ? (
          <></>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <StorySection
              key={'bookmarked'}
              title={`Bookmarked stories`}
              data={data}
              onStoryClick={onStoryClick}
            />
          </div>
        )}
        <Modal
          closeTimeoutMS={200}
          isOpen={!!activeStory}
          onRequestClose={handleClose}
          style={customStyles}
        >
          {activeStory && (
            <StoryPreview
              story={activeStory}
              onClose={handleClose}
              handleLikeClick={handleLikeClick}
              handleBookmarkClick={handleBookmarkClick}
            />
          )}
        </Modal>
      </main>
    </>
  )
}

function BookmarksPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) navigate('/')
  }, [user, isLoading, navigate])

  if (isLoading || !user) return <>Loading...</>

  return <Bookmarks />
}

export default BookmarksPage
