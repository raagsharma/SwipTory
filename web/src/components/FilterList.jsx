import { useHorizontalScroll } from '../hooks/scroll'
import FilterCard from './FilterCard'
import classes from './FilterList.module.css'

const FilterList = ({ filters, onFilterClick, currentFilter }) => {
  const scrollRef = useHorizontalScroll()

  return (
    <div className={classes.CardContainer} ref={scrollRef}>
      {filters.map((filter) => {
        return (
          <div key={filter.id} onClick={() => onFilterClick(filter.name)}>
            <FilterCard filter={filter} currentFilter={currentFilter} />
          </div>
        )
      })}
    </div>
  )
}

export default FilterList
