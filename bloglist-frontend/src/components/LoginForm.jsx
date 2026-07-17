const LoginForm = ({
  handleSubmit,
  username,
  password,
  handleUsernameChange,
  handlePasswordChange
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          username
          <input
            data-testid="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
          />
        </label>
      </div>

      <div>
        <label>
          password
          <input
            data-testid="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
      </div>

      <button type="submit">
        login
      </button>
    </form>
  )
}

export default LoginForm