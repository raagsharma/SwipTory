import { useState } from 'react'
import classes from './SignIn.module.css'
import CloseIcon from '../assets/close-icon.svg'
import { register, login } from '../api/auth'
import { useAuth } from '../hooks/auth'
import { parseJwt } from '../utils/jwt'

function Register({ onClose }) {
  const { setUser } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      await register(username, password)
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
    }
  }

  return (
    <div className={classes.FormWrapper}>
      <form className={classes.SignInForm} onSubmit={handleSubmit}>
        <div className={classes.FormHeader}>
          <div></div>
          <h4 className={classes.Title}>Register to SwipTory</h4>
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
          <button className={classes.formLoginBtn}>Register</button>
        </div>
      </form>
    </div>
  )
}

export default Register
