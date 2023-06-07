import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { InputGroup, FormControl, Image } from 'react-bootstrap'
import './style.scss'
import { SEARCH_BOX_CLEAR, SEARCH_BOX_ENTER } from '../../common/common-constants'

class SearchBox extends Component {
    static propTypes = {
        search: PropTypes.bool,
        pageName: PropTypes.string,
        actionName: PropTypes.func,
        parameters: PropTypes.object,
        onSearch: PropTypes.func,
        textValue: PropTypes.string
    }
    static defaultProps = {
        size: 'sm',
    }
    constructor(props) {
        super(props)
        this.state = {
            textValue: '',
            isKeyPressed: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    componentWillReceiveProps(nextProps) {

        if (this.props.textValue !== nextProps.textValue) {
            this.setState({ textValue: nextProps.textValue })
        }
    }

    handleChange(e) {
        const textValue = e.target.value
        if (textValue === '') { this.handleApply(SEARCH_BOX_CLEAR) }
        this.setState({
            textValue: textValue
        })
    }

    handleKeyPress(event) {
        if (event.key) {
            this.setState({ isKeyPressed: true })
        }
        if (event.key === "Enter") { this.handleApply(SEARCH_BOX_ENTER) }
    }

    handleApply(clickType, isCloseClicked) {
        const { onSearch } = this.props
        this.setState({
            searchClick: true, loader: false
        })
        let textTypeData = this.state.textValue.trim()
        if (isCloseClicked) {
            onSearch('')
            this.state.textValue = ''
        }
        else onSearch(clickType === SEARCH_BOX_CLEAR ? '' : textTypeData)
    }

    render() {
        const { placeholder, maxLength } = this.props
        const { textValue } = this.state

        return (
            <div className='search-box-overAll-style'>
                <InputGroup className='search-box-inputGroup'>
                    <FormControl
                        type={this.props.type}
                        className="inputstyle"
                        value={textValue}
                        maxLength={maxLength}
                        placeholder={placeholder}
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                    />
                </InputGroup>
                {this.state.isKeyPressed && textValue != '' ?
                    <i class="fa fa-close" aria-hidden="true"
                        id='search-box-fa-close'
                        onClick={this.handleApply.bind(this, SEARCH_BOX_CLEAR, true)}
                    /> :
                    <i class="fa fa-search" aria-hidden="true"
                        id='search-box-fa-search'
                        onClick={this.handleApply.bind(this, null, false)}
                    />
                }
            </div>
        )
    }
}
export default SearchBox