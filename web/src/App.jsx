import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/HomePage'
import { useEffect } from 'react'
import { useAuth } from './hooks/auth'
import Bookmarks from './Pages/Bookmarks'
import { parseJwt } from './utils/jwt'
import StoryPage from './Pages/StoryPage'

function App() {
  const { setUser, setIsLoading } = useAuth()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken) {
      const payload = parseJwt(accessToken)
      setUser({
        accessToken,
        ...payload,
      })
    }
    setIsLoading(false)
  }, [setUser, setIsLoading])

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/story/:id" element={<StoryPage />} />
      </Routes>
    </>
  )
}

export default App
