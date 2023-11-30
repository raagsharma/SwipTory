import StoryList from './StoryList'
import './StorySection.scoped.css'

export default function StorySection({ data, onStoryClick, title }) {
  return (
    <div className="Section">
      <h1 className="Title">{title}</h1>
      {data.length > 0 ? (
        <StoryList stories={data} onStoryClick={onStoryClick} />
      ) : (
        <p
          style={{
            margin: 'auto',
          }}
        >
          No stories found...
        </p>
      )}
    </div>
  )
}
