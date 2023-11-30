import NavBar from '../components/NavBar'
import FList from '../components/FilterList'
import { filtersList, categories } from '../utils/filters-list'
import useSWR from 'swr'
import { getStories } from '../api/stories'
import StoryPreview from '../components/StoryPreview'
import { useCallback, useState } from 'react'
import Modal from 'react-modal'
import StorySection from '../components/StorySection'
import {
  likeStory,
  unlikeStory,
  bookmarkStory,
  unbookmarkStory,
} from '../api/stories'
import { useAuth } from '../hooks/auth'
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

function Home() {
  const { user } = useAuth()

  const { isLoading, mutate } = useSWR(
    `/stories/${user?.username}`,
    getStories,
    {
      onSuccess: (data) => {
        const userId = user?.userId
        const sections = categories.map((c) => ({ category: c, stories: [] }))

        const yourStories = []

        data.forEach((story) => {
          if (userId) {
            if (story.userId === userId) {
              yourStories.push(story)
            }
          }

          const section = sections.find((s) => s.category === story.category)
          section && section.stories.push(story)
        })

        setSections(sections)
        setYourStories(yourStories)
      },
    }
  )

  const [activeStory, setActiveStory] = useState(undefined)

  const [activeFilter, setActiveFilter] = useState('All')

  const onFilterClick = (filter) => {
    setActiveFilter(filter)
  }

  const onStoryClick = useCallback((story) => {
    window.history.pushState('', '', `/story/${story._id}`)
    setActiveStory(story)
  }, [])

  const [sections, setSections] = useState([])

  const [yourStories, setYourStories] = useState([])

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
    window.history.pushState('', '', `/`)
  }

  return (
    <>
      <NavBar onRefresh={mutate}></NavBar>
      <main
        style={{
          padding: '2rem 3rem',
        }}
      >
        <FList
          filters={filtersList}
          onFilterClick={onFilterClick}
          currentFilter={activeFilter}
        />
        {isLoading ? (
          <></>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            {activeFilter === 'All' ? (
              <>
                {user && (
                  <StorySection
                    key={'yourStories'}
                    title={`Your Stories`}
                    data={yourStories}
                    onStoryClick={onStoryClick}
                  />
                )}
                {sections.map((section) => (
                  <StorySection
                    key={section.category}
                    title={`Top Stories about ${section.category}`}
                    data={section.stories}
                    onStoryClick={onStoryClick}
                  />
                ))}
              </>
            ) : (
              <StorySection
                key={activeFilter}
                title={`Top Stories about ${activeFilter}`}
                data={
                  sections.find((s) => s.category === activeFilter)?.stories ||
                  []
                }
                onStoryClick={onStoryClick}
              />
            )}
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

export default Home
