import useAnecdoteStore from '../store'

const AnecdoteForm = () => {
  const addAnecdote = useAnecdoteStore(
    (state) => state.addAnecdote
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    const content = event.target.anecdote.value.trim()

    if (!content) return

    addAnecdote(content)

    event.target.anecdote.value = ''
  }

  return (
    <div>
      <h2>Create new</h2>

      <form onSubmit={handleSubmit}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm