import React, { Component } from 'react'
import withCssClassName from '../with-css-class-name'
class CloseIcon extends Component {
    render() {
        return (
            <svg {...this.props} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" class='dropdownColor_svg' ><path d="M6.01 5L10 8.955 8.946 10 5 6.09 1.054 10 0 8.955 3.991 5 0 1.045 1.054 0 5 3.91 8.946 0 10 1.045z" /></svg>
        )
    }
}
export default withCssClassName(CloseIcon)