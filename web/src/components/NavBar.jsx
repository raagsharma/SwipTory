import { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'
import { useAuth } from '../hooks/auth'
import Register from './Register'
import { useApp } from '../hooks/app'
import AddStory from './AddStory'
import ClickOutside from './ClickOutside'
import { useEvent } from '../hooks/event'
import MenuIcon from '../assets/menu-icon.svg'
import './NavBar.scoped.css'

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

function NavBar({ onRefresh }) {
  const { openLoginModal } = useApp()
  const { user, setUser } = useAuth()

  const [initialStory, setInitialStory] = useState(undefined)

  const [modalIsOpen, setIsOpen] = useState(false)
  const [popupIsOpen, setPoupIsOpen] = useState(false)
  const [addStoryModalIsOpen, setStoryModalIsOpen] = useState(false)

  useEvent('editStory', (story) => {
    setInitialStory(story)
    setStoryModalIsOpen(true)
  })

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  function openAddStoryModal() {
    setStoryModalIsOpen(true)
  }

  function closeAddStoryModal() {
    setStoryModalIsOpen(false)
    setInitialStory(undefined)
    onRefresh()
  }

  function handleSignout() {
    setPoupIsOpen(false)
    setUser(null)
    localStorage.clear()
  }

  return (
    <>
      <div className="NavBar">
        <Link to="/">
          <h1 className="title">SwipTory</h1>
        </Link>

        {user ? (
          <div className="loggedIn">
            <div className="buttonGroup">
              <Link to="/bookmarks">
                <button className="button bookmarkBtn">Bookmarks</button>
              </Link>
              <button
                className="button addStoryBtn"
                onClick={openAddStoryModal}
              >
                Add Story
              </button>
              <img
                className="avatarIcon"
                src="https://i.pravatar.cc/300"
                alt="profile-pic"
              />
              <div style={{ position: 'relative' }}>
                <button
                  className="IconButton"
                  onClick={() => setPoupIsOpen((x) => !x)}
                >
                  <img className="menuIcon" src={MenuIcon} alt="" />
                </button>
                {popupIsOpen && (
                  <ClickOutside onClickOutside={() => setPoupIsOpen(false)}>
                    <div className="buttonPopup">
                      <p
                        style={{
                          fontSize: '20px',
                          fontWeight: 700,
                        }}
                      >
                        {user.username}
                      </p>
                      <button className="SignoutButton" onClick={handleSignout}>
                        Sign out
                      </button>
                    </div>
                  </ClickOutside>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="buttonGroup">
            <button className="button registerBtn" onClick={openModal}>
              Register Now
            </button>
            <button className="button signinBtn" onClick={openLoginModal}>
              Sign In
            </button>
          </div>
        )}
      </div>
      <Modal
        closeTimeoutMS={200}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <Register onClose={closeModal} />
      </Modal>
      <Modal
        closeTimeoutMS={200}
        isOpen={addStoryModalIsOpen}
        onRequestClose={closeAddStoryModal}
        style={customStyles}
      >
        <AddStory onClose={closeAddStoryModal} initialStory={initialStory} />
      </Modal>
    </>
  )
}
export default NavBar
