import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')
  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      person => person.name === newName
    )

    if (existingPerson) {
      const shouldUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (!shouldUpdate) {
        return
      }

      const updatedPerson = {
        ...existingPerson,
        number: newNumber
      }

      personService
        .update(existingPerson.id, updatedPerson)
        .then(response => {
          setPersons(
            persons.map(person =>
              person.id === existingPerson.id
                ? response.data
                : person
            )
          )

          setNewName('')
          setNewNumber('')
        })
        .catch(() => {
  setMessageType('error')
  setMessage(
    `Information of ${existingPerson.name} has already been removed from server`
  )

  setTimeout(() => {
    setMessage(null)
  }, 5000)

  setPersons(
    persons.filter(person => person.id !== existingPerson.id)
  )
})

      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(response => {
  setPersons(persons.concat(response.data))
  setMessageType('success')
  setMessage(`Added ${response.data.name}`)

  setTimeout(() => {
    setMessage(null)
  }, 5000)

  setNewName('')
  setNewNumber('')
})
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(
            persons.filter(person => person.id !== id)
          )
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />

      <form onSubmit={addPerson}>
        <div>
          name:
          <input
            value={newName}
            onChange={handleNameChange}
          />
        </div>

        <div>
          number:
          <input
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>

        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>

      {persons.map(person => (
        <p key={person.id}>
          {person.name} {person.number}{' '}
          <button
            onClick={() =>
              deletePerson(person.id, person.name)
            }
          >
            delete
          </button>
        </p>
      ))}
    </div>
  )
}

export default App