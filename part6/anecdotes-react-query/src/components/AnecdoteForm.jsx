const AnecdoteForm = ({ addAnecdote }) => {
  const handleSubmit = (event) => {
    event.preventDefault()

    const content = event.target.anecdote.value

    event.target.reset()

    addAnecdote(content)
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={handleSubmit}>
        <input name="anecdote" />

        <button type="submit">
          create
        </button>
      </form>
    </div>
  )
}

export default AnecdoteForm