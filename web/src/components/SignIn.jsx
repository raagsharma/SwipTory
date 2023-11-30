import { useState } from 'react'
import classes from './SignIn.module.css'
import CloseIcon from '../assets/close-icon.svg'
import { login } from '../api/auth'
import { useAuth } from '../hooks/auth'
import { parseJwt } from '../utils/jwt'

function SignIn({ onClose }) {
  const { setUser } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      setIsLoading(true)
      const response = await login(username, password)
      const payload = parseJwt(response.accessToken)
      setUser({
        ...response,
        ...payload,
      })
      localStorage.setItem('accessToken', response.accessToken)
      onClose()
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={classes.FormWrapper}>
      <form className={classes.SignInForm} onSubmit={handleSubmit}>
        <div className={classes.FormHeader}>
          <div></div>
          <h4 className={classes.Title}>Login to SwipTory</h4>
          <button className={classes.CloseButton} onClick={onClose}>
            <img src={CloseIcon} alt="" />
          </button>
        </div>
        <div className={classes.FormContent}>
          <div className={classes.FormItem}>
            <label className={classes.FormLabel} htmlFor="username">
              Username
            </label>
            <input
              type="text"
              name="username"
              className={classes.FormInput}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={classes.FormItem}>
            <label className={classes.FormLabel} htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              className={classes.FormInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        <div className={classes.FormActions}>
          <button className={classes.formLoginBtn} disabled={isLoading}>
            {isLoading ? 'Please wait...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SignIn
