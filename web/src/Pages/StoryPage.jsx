import useSWR from 'swr'
import { getStory } from '../api/stories'
import { useState } from 'react'
import Modal from 'react-modal'
import {
  likeStory,
  unlikeStory,
  bookmarkStory,
  unbookmarkStory,
} from '../api/stories'
import NavBar from '../components/NavBar'
import StoryPreview from '../components/StoryPreview'
import { useNavigate, useParams } from 'react-router-dom'
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

function Story({ initialStory }) {
  const navigate = useNavigate()
  const [story, setStory] = useState(initialStory)

  const dispatchEvent = useEventDispatch()

  async function handleLikeClick() {
    const storyId = story._id
    const currentLike = !!story.isLiked
    try {
      setStory((prev) => ({
        ...prev,
        isLiked: !currentLike,
      }))

      currentLike ? await unlikeStory(storyId) : await likeStory(storyId)
      dispatchEvent('refreshLike', {})
    } catch (error) {
      setStory((prev) => ({
        ...prev,
        isLiked: currentLike,
      }))
    }
  }

  async function handleBookmarkClick() {
    const storyId = story._id
    const currentBookmark = !!story.isBookmarked
    try {
      setStory((prev) => ({
        ...prev,
        isBookmarked: !currentBookmark,
      }))

      currentBookmark
        ? await unbookmarkStory(storyId)
        : await bookmarkStory(storyId)
    } catch (error) {
      setStory((prev) => ({
        ...prev,
        isBookmarked: currentBookmark,
      }))
    }
  }

  function handleClose() {
    navigate('/')
  }

  return (
    <>
      <NavBar></NavBar>
      <main
        style={{
          padding: '2rem 3rem',
        }}
      >
        <Modal
          closeTimeoutMS={200}
          isOpen={!!story}
          onRequestClose={handleClose}
          style={customStyles}
        >
          <StoryPreview
            story={story}
            onClose={handleClose}
            handleLikeClick={handleLikeClick}
            handleBookmarkClick={handleBookmarkClick}
          />
        </Modal>
      </main>
    </>
  )
}

function StoryPage() {
  const { id } = useParams()

  const { data, isLoading, error } = useSWR(`/story/:${id}`, () => getStory(id))

  if (isLoading) return <>Loading...</>

  if (error) return <>{error}</>

  if (!data) return <>No data...</>

  return <Story initialStory={data} />
}

export default StoryPage
