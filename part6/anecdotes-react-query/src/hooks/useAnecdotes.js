import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  getAnecdotes,
  createAnecdote,
  updateAnecdote,
} from '../requests'

import { useNotify } from '../NotificationContext'

const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const notify = useNotify()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,

    onSuccess: (newAnecdote) => {
      const anecdotes =
        queryClient.getQueryData(['anecdotes']) || []

      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.concat(newAnecdote)
      )

      notify(
        `anecdote '${newAnecdote.content}' created`
      )
    },

    onError: () => {
      notify(
        'too short anecdote, must have length 5 or more'
      )
    },
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,

    onSuccess: (updatedAnecdote) => {
      const anecdotes =
        queryClient.getQueryData(['anecdotes']) || []

      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map((anecdote) =>
          anecdote.id === updatedAnecdote.id
            ? updatedAnecdote
            : anecdote
        )
      )

      notify(
        `anecdote '${updatedAnecdote.content}' voted`
      )
    },
  })

  const addAnecdote = (content) => {
    newAnecdoteMutation.mutate(content)
  }

  const voteAnecdote = (anecdote) => {
    updateAnecdoteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1,
    })
  }

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addAnecdote,
    voteAnecdote,
  }
}

export default useAnecdotes