import {BsSearch} from 'react-icons/bs'
import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    getPage,
    clickedCategoryButton,
    clickedRatingButton,
    getSearchValue,
    onKeyPressed,
    titleSearch,
  } = props

  const onClickCategoryButton = Id => {
    clickedCategoryButton(Id)
  }

  const onClickRatingButton = Id => {
    clickedRatingButton(Id)
  }

  const onClickClearButton = () => {
    getPage()
  }

  const onChangeInputValue = event => {
    getSearchValue(event.target.value)
  }

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      onKeyPressed()
    }
  }

  return (
    <>
      <div className="input-field-container">
        <input
          className="input-styling"
          type="search"
          placeholder="Search"
          value={titleSearch}
          onChange={onChangeInputValue}
          onKeyPress={handleKeyPress}
        />
        <BsSearch className="icon" />
      </div>
      <h1 className="title-name">Category</h1>
      <ul className="category-list">
        {categoryOptions.map(eachItem => (
          <li className="list-items" key={eachItem.categoryId}>
            <button
              type="button"
              className="category-button"
              onClick={() => onClickCategoryButton(eachItem.categoryId)}
            >
              <p className="nameOfCategory">{eachItem.name}</p>
            </button>
          </li>
        ))}
      </ul>
      <h1 className="title-name1">Rating</h1>
      <ul className="ratings-list">
        {ratingsList.map(eachItems => (
          <li className="list-items2" key={eachItems.ratingId}>
            <button
              className="rating-button"
              type="button"
              onClick={() => onClickRatingButton(eachItems.ratingId)}
            >
              <img
                className="star-image"
                src={eachItems.imageUrl}
                alt={`rating ${eachItems.ratingId}`}
              />
              & up
            </button>
          </li>
        ))}
      </ul>
      <button
        className="clear-button"
        type="button"
        onClick={onClickClearButton}
      >
        Clear Filters
      </button>
    </>
  )
}

export default FiltersGroup
