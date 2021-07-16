import React, { useState, useEffect } from 'react'
import SearchFilterForm from './components/SearchFilterForm'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'
import Notification from './components/Notification'
import Error from './components/Error'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [displayMessage, setDisplayMessage] = useState(null)
  
  // Fetching data from server using Effect Hook
  useEffect(() => {
    personsService
      .getAll()
      .then(initPersons => {
        setPersons(initPersons)
      })
  }, [])

  // Adding a new name to persons
  const addName = (event) => {
    // Preventing default action of the event
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber
    }

    console.log(personObject.name)

    // Checking if there's a duplicate in persons
    if(persons.some(p => p.name === personObject.name)){
      // Confirm the number changing
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const contact = persons.find(p => p.name === personObject.name)
        const changedContact = { ...contact, number: personObject.number}
        
        // Let's do it for server
        personsService
        .updateNumber(changedContact.id, changedContact)
        .then(returnedContact => { 
          setPersons(persons.map(person => person.id !== contact.id ? person : returnedContact))
          setDisplayMessage(`Updated contact ${contact.name} succesfully!`)
          setNewName('')
          setNewNumber('')
        })
        //If wanted contact already deleted, alarm the user
        .catch(error => {
          setErrorMessage(`Information of ${contact.name} has already been removed from server`)
          setPersons(persons.filter(p => p.id !== personObject.id))
        })
      } 

    // Sending a whole new contact to server
    } else {
      personsService
      .create(personObject)
      .then(newObject => {
        setDisplayMessage(`Added ${personObject.name}`) 
        setPersons(persons.concat(newObject))
        setNewName('')
        setNewNumber('')
         })
    }

    setTimeout(() => {
      setErrorMessage(null)
      setDisplayMessage(null)
    }, 5000)  
  }

  // Deleting a contact if button pressed and confirmed
  const deleteContact = (id) => {
    // Searching the contact name of specific id
    const person = persons.find(p => p.id === id)
    console.log(person.name)
    
    if(window.confirm(`Delete ${person.name}?`)) {
        personsService.deleteContact(id)
        .then(() => { setPersons(persons.filter(p => p.id !== id))})
        setDisplayMessage(`${person.name} with number ${person.number} succesfully deleted from the phonebook`)
    } else {
        setDisplayMessage(`${person.name} not removed - cancelled by the user`)
    }

    setTimeout(() => {
        setErrorMessage(null)
        setDisplayMessage(null)
      }, 5000)  
  }

  // Handling name changing when written
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  // Handling number changing when written
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  // Handling searchfilter changing when written
  const handleSearchFilterChange = (event) => {
    setSearchFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={displayMessage} />
      <Error message={errorMessage} />
      <SearchFilterForm searchFilter={searchFilter} handleSearch={handleSearchFilterChange}/>

      <h3>Add a new contact</h3>
      <PersonForm name={newName} handleNames={handleNameChange}
                  number={newNumber} handleNumbers={handleNumberChange}
                  addName={addName}/>

      <h3>Numbers</h3>
      <Persons persons={persons} searchFilter={searchFilter} deleteContact={deleteContact}/>
    </div>
  )
}

export default App;