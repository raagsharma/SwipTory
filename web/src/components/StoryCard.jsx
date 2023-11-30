import classes from './StoryCard.module.css'
import EditIcon from '../assets/edit-icon.svg'
import { useEventDispatch } from '../hooks/event'
import { useAuth } from '../hooks/auth'

const StoryCard = ({ story }) => {
  const { user } = useAuth()

  const { id, slides, userId } = story

  const { heading, description, image } = slides[0]

  const dispatchEvent = useEventDispatch()

  return (
    <div key={id} className={classes.card}>
      <div className={classes.info}>
        <span className={classes.cardTitle}>{heading}</span>
        <span className={classes.cardDesc}>{description}</span>
      </div>

      <img className={classes.cardImage} src={image} alt="" />
      {user?.userId === userId && (
        <button
          className={classes.EditButton}
          onClick={(e) => {
            e.stopPropagation()
            dispatchEvent('editStory', story)
          }}
        >
          <img
            src={EditIcon}
            style={{
              height: '16px',
              marginTop: '-2px',
            }}
            alt=""
          />
          Edit
        </button>
      )}
    </div>
  )
}

export default StoryCard
