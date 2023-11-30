import allImg from '../assets/all.png'
import foodImg from '../assets/food.jpg'
import healthImg from '../assets/health.jpg'
import travelImg from '../assets/travel.jpg'
import moviesImg from '../assets/movies.png'
import educationImg from '../assets/education.jpg'

export const filtersList = [
  { id: 1, name: 'All', image: allImg },
  { id: 2, name: 'Food', image: foodImg },
  { id: 3, name: 'Health and Fitness', image: healthImg },
  { id: 4, name: 'Travel', image: travelImg },
  { id: 5, name: 'Movies', image: moviesImg },
  { id: 6, name: 'Education', image: educationImg },
]

export const categories = filtersList
  .map((item) => item.name)
  .filter((item) => item !== 'All')
