import axios from 'axios'

// ** All communication with server in this module **

const baseUrl = '/api/persons'


// Fetching all data from server
const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
}

// Creating a new contact and sending to server
const create = newObject => {
    return axios.post(baseUrl, newObject).then(response => response.data)
}

// Deleting a contact from server
const deleteContact = id => {
    return axios.delete(`${baseUrl}/${id}`).then(response => response.data)
}

// Updating a number for an existing contact
const updateNumber = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)
}

const exportedObjects = {getAll, create, deleteContact, updateNumber}

export default exportedObjects;