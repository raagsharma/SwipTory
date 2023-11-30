import axios from 'axios'

export async function login(username, password) {
  try {
    const response = await axios.post('/login', {
      username,
      password,
    })
    return response.data
  } catch (error) {
    const message = error.response.data || 'Authentication failed'
    throw Error(message)
  }
}

export async function register(username, password) {
  try {
    const response = await axios.post('/register', {
      username,
      password,
    })
    return response.data
  } catch (error) {
    const message = error.response.data || 'Authentication failed'
    throw Error(message)
  }
}
