import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    } 
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      setNewNumber('')
      return
    }

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const handlePersonChange = (event) => {
   console.log(event.target.value)
   setNewName(event.target.value)
  }

  const handleNameChange = (event) => {
   console.log(event.target.value)
   setNewNumber(event.target.value)
  }

  return (
    
    <div>
      {/* <div>debug: {newName}</div> */}
      <h2>Phonebook</h2>
      <input 
        value={filter}
        onChange={handleFilter}/>

      <h2>add a new</h2>
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
      <h2>Numbers</h2>
        {persons.map(person =>
         <p key={person.name}>{person.name} {person.number}</p>
        )}
    </div>
  )

}

export default App