import React, { Component } from 'react'

import withCssClassName from '../with-css-class-name'

class CaretDownIcon extends Component {
    render() {
        return (
            <svg {...this.props} xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" class='dropdownColor_svg'><path d="M8.946 0L10 1.045 5 6 0 1.045 1.054 0 5 3.91z"/></svg>
        )
    }
}

export default withCssClassName(CaretDownIcon)
