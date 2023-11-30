import axios from 'axios'

export async function getStories() {
  try {
    const response = await axios.get('/stories')
    return response.data
  } catch (error) {
    throw new Error('Failed to get stories')
  }
}

export async function addStory(story) {
  try {
    const response = await axios.post('/story', story)
    return response.data
  } catch (error) {
    throw new Error('Failed to add story')
  }
}

export async function editStory(id, story) {
  try {
    const response = await axios.put('/story/' + id, story)
    return response.data
  } catch (error) {
    throw new Error('Failed to edit story')
  }
}

export async function getStory(id) {
  try {
    const response = await axios.get(`/story/${id}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to get story')
  }
}

export async function getStoriesByCategory(category) {
  try {
    const response = await axios.get(`/story/category/${category}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to get stories')
  }
}

export async function getStoryLikesCount(id) {
  try {
    const response = await axios.get(`/story/${id}/likeCount`)
    return response.data
  } catch (error) {
    throw new Error('Failed to like story')
  }
}

export async function likeStory(id) {
  try {
    const response = await axios.post(`/story/${id}/like`, null)
    return response.data
  } catch (error) {
    throw new Error('Failed to like story')
  }
}

export async function unlikeStory(id) {
  try {
    const response = await axios.post(`/story/${id}/unlike`, null)
    return response.data
  } catch (error) {
    throw new Error('Failed to unlike story')
  }
}

export async function bookmarkStory(id) {
  try {
    const response = await axios.post(`/story/${id}/bookmark`, null)
    return response.data
  } catch (error) {
    throw new Error('Failed to bookmark story')
  }
}

export async function unbookmarkStory(id) {
  try {
    const response = await axios.post(`/story/${id}/unbookmark`, null)
    return response.data
  } catch (error) {
    throw new Error('Failed to unbookmark story')
  }
}

export async function getBookmarkedStories() {
  try {
    const response = await axios.get('/story/bookmarked')
    return response.data
  } catch (error) {
    throw new Error('Failed to get bookmarked stories')
  }
}

export async function getMyStories() {
  try {
    const response = await axios.get('/stories/me')
    return response.data
  } catch (error) {
    throw new Error('Failed to get my stories')
  }
}
