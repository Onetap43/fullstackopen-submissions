import {
  Button,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'

const LoginForm = ({
  handleSubmit,
  username,
  password,
  handleUsernameChange,
  handlePasswordChange
}) => {
  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 420,
        mx: 'auto',
        mt: 5,
        p: 4
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
      >
        Login
      </Typography>

      <Stack
        component="form"
        spacing={2}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          data-testid="username"
          value={username}
          onChange={handleUsernameChange}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          data-testid="password"
          value={password}
          onChange={handlePasswordChange}
        />

        <Button
          variant="contained"
          type="submit"
          size="large"
        >
          Login
        </Button>
      </Stack>
    </Paper>
  )
}
export default LoginForm