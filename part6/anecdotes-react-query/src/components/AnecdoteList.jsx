const AnecdoteList = ({
  anecdotes,
  voteAnecdote,
}) => {
  const sortedAnecdotes = [...anecdotes].sort(
    (first, second) =>
      second.votes - first.votes
  )

  return (
    <div>
      <h2>Anecdotes</h2>

      {sortedAnecdotes.map((anecdote) => (
        <div
          key={anecdote.id}
          style={{ marginBottom: 15 }}
        >
          <div>
            {anecdote.content}
          </div>

          <div>
            has {anecdote.votes} votes{' '}

            <button
              type="button"
              onClick={() =>
                voteAnecdote(anecdote)
              }
            >
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList