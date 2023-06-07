import React, { Component } from "react";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import '../flagIcon/flagIcon.scss'

let bundleHierarchy, isLoggedIn,
    requestedFlagIcon = '',
    isFlagPresent = false

const mapStateToProps = (state) => {
    return {
    }
}
class FlagIcon extends Component {
    static propTypes = {
        flagIconClassName: PropTypes.string
    }
    static defaultProps = {
        flagIconClassName: 'flagCircleIcon',
    }

    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentWillMount() {
        isLoggedIn = JSON.parse(sessionStorage.getItem('loginUserDetails'))
        bundleHierarchy = JSON.parse(
            isLoggedIn && isLoggedIn.defaultOption
                ? isLoggedIn.defaultOption.StaticConstants
                : {}
        )
        isFlagPresent = isLoggedIn && isLoggedIn.module && isLoggedIn.module.logo
        this.setState({
            requestedFlagIcon:
                isLoggedIn && isLoggedIn.module && isLoggedIn.module.logo
        })
    }

    render() {
        const { flagIconClassName } = this.props;
        return (
            <div>
                <img src={this.state.requestedFlagIcon}
                    className={isFlagPresent ? flagIconClassName : ''}
                />
            </div>
        )
    }

}
export default connect(mapStateToProps, null)(FlagIcon)