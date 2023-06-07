import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style.scss'
import {
  SMALL,
  SEARCH_BOX_CLEAR,
  SEARCH_BOX_ENTER,
  SEARCH_BAR_INFO_MESSAGE,
} from '../../common/common-constants'
import { connect } from 'react-redux'
import ApiUtil from '../../common/api-util'

let requestParams = {
    retailerList: [],
    toDate: '',
    organizationId: '',
    suggestionWord: '',
  },
  initialrender=true

class SearchBar extends Component {
  static propTypes = {
    search: PropTypes.bool,
    pageName: PropTypes.string,
    actionName: PropTypes.func,
    parameters: PropTypes.object,
    onSearch: PropTypes.func,
    query: PropTypes.string,
    isCleared: PropTypes.bool,
    suggestion: PropTypes.func,
    inputClassName: PropTypes.string,
    searchbarClassName: PropTypes.string,
    keywordValue: PropTypes.string,
    getSuggestionList: PropTypes.string,
    resetClicked: PropTypes.bool
  }
  static defaultProps = {
    size: SMALL,
    isCleared: false,
    inputClassName: 'searchboxPlaceholder',
    searchbarClassName: 'searchBarandIcon',
    resetClicked : false
  }

  constructor(props) {
    super(props)
    this.state = {
      query: '',
      suggestioListes: [],
      isKeyPressed: false,
      isClearedText: false,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleApply = this.handleApply.bind(this)
  }

  componentWillMount() {
    initialrender = true
  }

  componentWillReceiveProps(nextProps) {
    const { isCleared } = this.props
    if (  this.props.resetClicked ||  (initialrender && this.props.keywordValue)) {
      this.setState({
        query: this.props.keywordValue,
      })
      initialrender = false
    }
    if (this.props.query !== nextProps.query) {
      this.setState({ query: nextProps.query })
    }
    if (isCleared) {
      this.setState({ query: '' })
    }
  }

  handle(e) {
    this.state.query = ''
    this.state.query = e.target.textContent
    this.state.suggestioListes = []
    this.handleApply(SEARCH_BOX_ENTER)
  }

  suggestionOptionList = (props) => {
    this.state.query == '' ? (props = []) : ''
    const options =
      props != undefined &&
      props.length > 0 &&
      props.map((values) => (
        <li
          key={values}
          onClick={this.handle.bind(this)}
          className={'li-suggestion-listes'}
        >
          {values}
        </li>
      ))
    return <div className="div-class-list"> {options} </div>
  }

  handleChange(e) {
    this.setState({ suggestioListes: [] })
    const query = e.target.value
    requestParams.suggestionWord = e.target.value
    this.setState({ query: query })
    if (query === '') {
      this.handleApply(SEARCH_BOX_CLEAR)
      this.setState({ suggestioListes: [] })
    }
    // Trigger API call when user types keyword
    this.props.getSuggestionList != undefined && e.target.value != ''
      ? ApiUtil.post(this.props.getSuggestionList, requestParams, '').then(
          (response) => {
            this.handleResponse(response, '')
          }
        )
      : (this.state.suggestioListes = [])
  }

  // To set Response data in suggestion list
  handleResponse(content, params) {
    let responseData = {
      content,
      params,
      isFetching: false,
    }
    this.setState({ suggestioListes: [] })
    this.setState({
      suggestioListes:
        responseData.content != undefined && responseData.content.data,
    })
  }

  handleKeyPress(event) {
    this.setState({ suggestioListes: [] })
    if (event.key) {
      this.setState({ suggestioListes: [] })
      this.setState({ isKeyPressed: true })
    }
    if (event.key === 'Enter') {
      this.handleApply(SEARCH_BOX_ENTER)
    }
  }

  handleApply(clickType, isCloseClicked, data) {
    const { onSearch } = this.props

    if (clickType === SEARCH_BOX_CLEAR)
      this.setState({ suggestioListes: [], isClearedText: true })
    if (clickType != null && this.state.query !== '') {
      let textTypeData = this.state.query.trim()
      if (isCloseClicked) {
        this.setState({ suggestioListes: [], query: '' })
        onSearch('')
      } else onSearch(clickType === SEARCH_BOX_CLEAR ? '' : textTypeData)
    }
  }

  render() {
    const {
      placeholder,
      maxLength,
      inputClassName,
      searchbarClassName,
      keywordValue,
    } = this.props
    /**  To empty the suggestion list array if user doesn't type any keyword
    Can't use setState in render so update the list using this.state method 
    * */
    this.state.query == '' ? (this.state.suggestioListes = []) : ''

    return (
      /**  Search bar suggestion will enable only when user sends keywordvalue in props   */
        <div className={searchbarClassName}>
          <div>
            <form>
              <input
                placeholder={placeholder}
                className={inputClassName}
                value={this.state.query}
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
              />
              {this.props.keywordValue ? 
                    this.suggestionOptionList(this.state.suggestioListes)
               : ""}
            </form>
          </div>
         {!this.props.keywordValue ? (this.state.isKeyPressed && this.state.query != '' ? (
            <i
              class="fa fa-close"
              aria-hidden="true"
              id="searchBarBox_style1"
              onClick={this.handleApply.bind(this, SEARCH_BOX_CLEAR, true)}
            />
          ) : (
            <i
              class="fa fa-search"
              aria-hidden="true"
              id="searchBarBox_style2"
              onClick={this.handleApply.bind(this, null, false)}
            />
          ))  : ""} 
        </div>
    )
  }
}

export default connect(null, null)(SearchBar)
