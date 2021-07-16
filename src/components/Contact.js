import React from 'react'

// Initializing one contact for Phonebook
// Putting it onto a table with delete button
const Contact = (props) => {
    const {id, name, number, deleteContact} = props
    
    return(
        <table>
            <tbody>
                <tr>
                    <td style={{width:'130px', paddingBottom:'5px'}}>{name}</td>
                    <td style={{width:'130px', paddingBottom:'5px'}}>{number}</td>
                    <td><button onClick={() => deleteContact(id)}> delete </button></td>
                 </tr>
            </tbody> 
        </table>
    )
}

export default Contact;