import StoryCard from './StoryCard'
import classes from './StoryList.module.css'
// import { useHorizontalScroll } from '../hooks/scroll'

const StoryList = ({ stories, onStoryClick }) => {
  // const scrollRef = useHorizontalScroll()
  return (
    <div className={classes.CardContainer}>
      {stories.map((story) => {
        return (
          <div
            className={classes.storyCard}
            key={story._id}
            onClick={() => onStoryClick(story)}
          >
            <StoryCard story={story} />
          </div>
        )
      })}
    </div>
  )
}

export default StoryList
