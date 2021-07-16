import React from 'react' 

// Form for search field
const SearchFilter = (props) => {
  const {searchFilter, handleSearch} = props
    return(
        <form>
        <div> Filter shown with 
          <input
            value={searchFilter}
            onChange={handleSearch} />
        </div>
      </form>
    )
}

export default SearchFilter;