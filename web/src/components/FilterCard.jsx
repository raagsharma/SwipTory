import './FilterCard.scoped.css'

const FilterCard = ({ filter, currentFilter }) => {
  const { id, name, image } = filter
  return (
    <div
      key={id}
      className="card"
      style={{
        borderColor: name === currentFilter ? '#00acd2' : 'white',
      }}
    >
      <span className="cardTitle">{name}</span>
      <img className="cardImage" src={image} alt="" />
    </div>
  )
}

export default FilterCard
