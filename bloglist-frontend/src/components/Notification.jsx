import { Alert, Snackbar } from '@mui/material'

const Notification = ({ message, type }) => {
  if (!message) {
    return null
  }

  return (
    <Snackbar
      open={true}
      autoHideDuration={5000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      <Alert
        severity={
          type === 'error'
            ? 'error'
            : 'success'
        }
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Notification