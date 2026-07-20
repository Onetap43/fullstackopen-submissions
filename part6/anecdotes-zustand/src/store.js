import { create } from 'zustand'
import initialAnecdotes from './anecdotes'

const generateId = () =>
  crypto.randomUUID()

const useAnecdoteStore = create((set) => ({
  anecdotes: initialAnecdotes.map((content) => ({
    content,
    votes: 0,
    id: generateId(),
  })),

  addAnecdote: (content) =>
    set((state) => ({
      anecdotes: state.anecdotes.concat({
        content,
        votes: 0,
        id: generateId(),
      }),
    })),

  voteAnecdote: (id) =>
    set((state) => ({
      anecdotes: state.anecdotes.map((anecdote) =>
        anecdote.id === id
          ? {
              ...anecdote,
              votes: anecdote.votes + 1,
            }
          : anecdote
      ),
    })),
}))

export default useAnecdoteStore