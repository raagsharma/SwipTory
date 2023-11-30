import { useContext, useEffect } from 'react'
import { EventContext } from '../contexts/EventEmitter'

export const useEventDispatch = () => {
  const [_subscribe, _unsubscribe, dispatch] = useContext(EventContext)

  return dispatch
}

export const useEvent = (event, callback) => {
  const [subscribe, unsubscribe, _dispatch] = useContext(EventContext)

  useEffect(() => {
    subscribe(event, callback)

    return () => unsubscribe(event, callback)
  }, [subscribe, unsubscribe, event, callback])
}
