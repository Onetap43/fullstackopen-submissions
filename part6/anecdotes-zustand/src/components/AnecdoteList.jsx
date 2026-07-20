import useAnecdoteStore from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdoteStore(
    (state) => state.anecdotes
  )

  const voteAnecdote = useAnecdoteStore(
    (state) => state.voteAnecdote
  )

  const sortedAnecdotes = [...anecdotes].sort(
    (a, b) => b.votes - a.votes
  )

  return (
    <>
      {sortedAnecdotes.map((anecdote) => (
        <div
          key={anecdote.id}
          style={{ marginBottom: 20 }}
        >
          <div>{anecdote.content}</div>

          <div>
            has {anecdote.votes} votes

            <button
              onClick={() =>
                voteAnecdote(anecdote.id)
              }
            >
              vote
            </button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList