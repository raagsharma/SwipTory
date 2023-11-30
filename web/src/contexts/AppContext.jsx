import { createContext, useState } from 'react'
import Modal from 'react-modal'
import SignIn from '../components/SignIn'

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '20px',
  },
}

export const AppContext = createContext({
  openLoginModal: () => {},
})

export const AppProvider = ({ children }) => {
  const [loginOpen, setLoginOpen] = useState(false)

  function closeModal() {
    setLoginOpen(false)
  }

  function openLoginModal() {
    setLoginOpen(true)
  }

  return (
    <AppContext.Provider
      value={{
        openLoginModal,
      }}
    >
      <Modal
        closeTimeoutMS={200}
        isOpen={loginOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <SignIn onClose={closeModal} />
      </Modal>
      {children}
    </AppContext.Provider>
  )
}
