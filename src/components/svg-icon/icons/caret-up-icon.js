import React, { Component } from 'react'

import withCssClassName from '../with-css-class-name'

class CaretUpIcon extends Component {
    render() {
        return (
            <svg {...this.props} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" class='dropdownColor_svg'><path d="M8.946 6L10 4.955 5 0 0 4.955 1.054 6 5 2.09z"/></svg>
        )
    }
}

export default withCssClassName(CaretUpIcon)
