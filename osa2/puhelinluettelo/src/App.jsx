import { useState,useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )
  const [notificationMessage, setNotificationMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    } 
    if (persons.some(person => person.name === newName)) {
      const existingPerson = persons.find(person => person.name === newName)
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(existingPerson.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            setNotificationMessage(`Updated number of ${newName}`)
            setTimeout(() => {
            setNotificationMessage(null)
            }, 5000)
          })
          .catch(() => {
            setErrorMessage(
              `Information of ${newName} has already been removed from server`
            )
            setPersons(persons.filter(p => p.id !== existingPerson.id))
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
    setNewName('')
    setNewNumber('')
    return
    }

    personService
      .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotificationMessage(
            `Added ${newName}`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
      })
      .catch(error => {
        //console.log(error.response.data)
        setErrorMessage(error.response.data.error)
        setNewName('')
        setNewNumber('')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const handlePersonChange = (event) => {
   console.log(event.target.value)
   setNewName(event.target.value)
  }

  const handleNameChange = (event) => {
   console.log(event.target.value)
   setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const handleDelete = (id, name) => {
    if (confirm(`Delete ${name} ?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
      setNotificationMessage(
          `Deleted ${name}`
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
    }

  }

  return (
    
    <div>
      {/* <div>debug: {newName}</div> */}
      <h2>Phonebook</h2>

      <Notification message={notificationMessage} isError={false} />
      <Notification message={errorMessage} isError={true} />

      <Filter filter={filter} handleFilter={handleFilter} />

      <h2>add a new</h2>

      <PersonForm 
        addPerson={addPerson} 
        handlePersonChange={handlePersonChange}
        handleNameChange = {handleNameChange}
        newName={newName}
        newNumber={newNumber}
        />

      <h2>Numbers</h2>

      <Persons 
        filteredPersons={filteredPersons}
        handleDelete={handleDelete}
        />
    </div>
  )

}

const Filter = ({ filter, handleFilter}) => {
  return (
    <div>
        filter shown with
      <input 
        value={filter}
        onChange={handleFilter}
      />
      </div>
  )

}

const PersonForm = ({ addPerson, handlePersonChange, handleNameChange, newName, newNumber}) => {
  return (
    <form onSubmit={addPerson}>
        <div>
          name: <input
                  value={newName}
                  onChange={handlePersonChange} 
                /><br />
          number: <input
                    value = {newNumber}
                    onChange = {handleNameChange}
                  />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ({ filteredPersons, handleDelete }) => (
  filteredPersons.map(person =>
         <p key={person.id}>
          {person.name} {person.number} 
          <button onClick={() => handleDelete(person.id, person.name)}>
            delete
          </button></p>
        )
)


export default App