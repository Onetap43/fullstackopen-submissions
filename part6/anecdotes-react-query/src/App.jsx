import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import useAnecdotes from './hooks/useAnecdotes'

const App = () => {
  const {
    anecdotes,
    isPending,
    isError,
    addAnecdote,
    voteAnecdote,
  } = useAnecdotes()

  if (isPending) {
    return <div>loading data...</div>
  }

  if (isError) {
    return (
      <div>
        anecdote service not available due to
        problems in server
      </div>
    )
  }

  return (
    <div>
      <h1>Anecdote app</h1>

      <Notification />

      <AnecdoteForm
        addAnecdote={addAnecdote}
      />

      <AnecdoteList
        anecdotes={anecdotes}
        voteAnecdote={voteAnecdote}
      />
    </div>
  )
}

export default App