import React from 'react' 

// Adding a new contact to phonebook
const PersonForm = (props) => {
    const {name, handleNames, number,  handleNumbers, addName} = props
    return(
        <form onSubmit={addName}>
            <div>Name: 
                <input
                    value={name}
                    onChange={handleNames} />
            </div>
            <div>Number:
                <input
                    value={number}
                    onChange={handleNumbers} />
            </div>
            <div>
                <button type="submit">Add</button>
            </div>
        </form>
    )
}

export default PersonForm;