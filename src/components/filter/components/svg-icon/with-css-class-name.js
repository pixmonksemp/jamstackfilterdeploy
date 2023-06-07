import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default function injectClassName(WrappedComponent, defaultClassName = 'svg-icon') {
    return class extends Component {
        static propTypes = {
            className: PropTypes.string
        }

        render() {
            const { className, ...otherProps } = this.props
            const classNames = []

            if (className) {
                className.split(' ').filter(c => c).map(c => classNames.push(c))
            }

            if (classNames.indexOf(defaultClassName) < 0) {
                classNames.push(defaultClassName)
            }

            return (
                <WrappedComponent className={classNames.join(' ')} {...otherProps} />
            )
        }
    }
}
