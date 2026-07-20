import {
  createContext,
  useContext,
  useReducer,
} from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload

    case 'CLEAR_NOTIFICATION':
      return ''

    default:
      return state
  }
}

export const NotificationContextProvider = ({
  children,
}) => {
  const [notification, dispatch] = useReducer(
    notificationReducer,
    ''
  )

  return (
    <NotificationContext.Provider
      value={{ notification, dispatch }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error(
      'useNotificationValue must be used inside NotificationContextProvider'
    )
  }

  return context.notification
}

export const useNotify = () => {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error(
      'useNotify must be used inside NotificationContextProvider'
    )
  }

  const notify = (message) => {
    context.dispatch({
      type: 'SET_NOTIFICATION',
      payload: message,
    })

    setTimeout(() => {
      context.dispatch({
        type: 'CLEAR_NOTIFICATION',
      })
    }, 5000)
  }

  return notify
}

export default NotificationContext