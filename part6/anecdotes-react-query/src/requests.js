const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }

  return response.json()
}

export const createAnecdote = async (content) => {
  const newAnecdote = {
    content,
    votes: 0,
  }

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newAnecdote),
  })

  if (!response.ok) {
    throw new Error('Failed to create anecdote')
  }

  return response.json()
}

export const updateAnecdote = async (updatedAnecdote) => {
  const response = await fetch(
    `${baseUrl}/${updatedAnecdote.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedAnecdote),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to update anecdote')
  }

  return response.json()
}