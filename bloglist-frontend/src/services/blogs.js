import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = newToken
    ? `Bearer ${newToken}`
    : null
}

const getConfig = () => ({
  headers: token
    ? { Authorization: token }
    : {}
})

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newBlog) => {
  const response = await axios.post(
    baseUrl,
    newBlog,
    getConfig()
  )

  return response.data
}

const update = async (id, updatedBlog) => {
  const response = await axios.put(
    `${baseUrl}/${id}`,
    updatedBlog
  )

  return response.data
}

const remove = async (id) => {
  const response = await axios.delete(
    `${baseUrl}/${id}`,
    getConfig()
  )

  return response.data
}

export default {
  getAll,
  create,
  update,
  remove,
  setToken
}