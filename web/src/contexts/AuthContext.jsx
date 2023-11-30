import { createContext, useState } from 'react'

export const AuthContext = createContext({
  user: {},
  setUser: () => {},
  isLoading: false,
  setIsLoading: () => {},
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
