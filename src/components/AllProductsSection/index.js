import {Component} from 'react'
// import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const ApiStatus = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    category: '',
    titleSearch: '',
    rating: '',
    statusOfResponse: ApiStatus.loading,
  }

  componentDidMount() {
    this.getProducts()
  }

  //

  getProducts = async () => {
    const jwtToken = Cookies.get('jwt_token')
    // TODO: Update the code to get products with filters applied

    const {activeOptionId, category, titleSearch, rating} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&title_search=${titleSearch}&rating=${rating}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      this.setState({statusOfResponse: ApiStatus.loading})
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedData = fetchedData.products.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))
        this.setState({
          productsList: updatedData,
          statusOfResponse: ApiStatus.success,
        })
      } else {
        throw new Error()
      }
    } catch (error) {
      this.setState({statusOfResponse: ApiStatus.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  getPage = () => {
    this.setState({rating: '', category: '', titleSearch: ''}, this.getProducts)
  }

  getSearchValue = searchValue => {
    this.setState(
      {
        titleSearch: searchValue,
      },
      //   this.getProducts,
    )
  }

  onKeyPressed = () => {
    this.getProducts()
  }

  clickedCategoryButton = Id => {
    this.setState({category: Id}, this.getProducts)
  }

  clickedRatingButton = Id => {
    this.setState({rating: Id}, this.getProducts)
  }

  //   onChangeInputValue1 = event => {
  //     this.setState({titleSearch: event.target.value})
  //   }

  //   onKeyPress = event => {
  //     if (event.key === 'Enter') {
  //       this.getProducts()
  //       //   this.setState({titleSearch: ''})
  //     }
  //   }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        {productsList.length > 0 ? (
          <>
            <ProductsHeader
              activeOptionId={activeOptionId}
              sortbyOptions={sortbyOptions}
              changeSortby={this.changeSortby}
              productsList={productsList}
            />
            <div className="productCard-filterGroup-container">
              {/* <div className="filtersGroup-container">
                <FiltersGroup
                  categoryOptions={categoryOptions}
                  ratingsList={ratingsList}
                  getPage={this.getPage}
                  clickedCategoryButton={this.clickedCategoryButton}
                  clickedRatingButton={this.clickedRatingButton}
                />
              </div> */}
              <div>
                <ul className="products-list">
                  {productsList.map(product => (
                    <ProductCard productData={product} key={product.id} />
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : (
          this.renderNotFoundImageView()
        )}
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureViewImage = () => (
    <div className="failure-image-container">
      <img
        className="fail-image"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1 className="heading1">Oops! Something Went Wrong</h1>
      <p className="info">
        We are having some trouble processing your request.
        <br />
        Please try again later.
      </p>
    </div>
  )

  renderNotFoundImageView = () => (
    <div className="failure-image-container">
      <img
        className="fail-image"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
      />
      <h1 className="heading1">No Products Found</h1>
      <p className="info-1">
        We could not find any products.Try other filters.
      </p>
    </div>
  )

  renderPage = () => {
    const {statusOfResponse} = this.state
    switch (statusOfResponse) {
      case ApiStatus.failure:
        return this.renderFailureViewImage()
      case ApiStatus.success:
        return this.renderProductsList()
      case ApiStatus.loading:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {searchInputValue} = this.state

    return (
      <div className="all-products-section">
        <div>
          <FiltersGroup
            categoryOptions={categoryOptions}
            ratingsList={ratingsList}
            getPage={this.getPage}
            clickedCategoryButton={this.clickedCategoryButton}
            clickedRatingButton={this.clickedRatingButton}
            searchInputValue={searchInputValue}
            getSearchValue={this.getSearchValue}
            onKeyPressed={this.onKeyPressed}
          />
        </div>
        <div>{this.renderPage()}</div>
      </div>
    )
  }
}

export default AllProductsSection
