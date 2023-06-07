import PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'react-bootstrap'
import classNames from 'classnames'

/**
 * Wrap an element with IconGroup to position an icon within and enable
 * coloring the icon via bootstrap state.
 *
 * Has special support for wrapping <FormControl> elements: places the icon
 * inside of the input and increase the left/right padding accordingly.
 *
 * To simply display a colored icon with no special positioning logic,
 * use position="static".
 */
class IconGroup extends React.Component {
    static propTypes = {
        bsClass: PropTypes.string.isRequired,
        bsSize: PropTypes.oneOf(['small', 'large']),
        bsStyle: PropTypes.oneOf(['success', 'default', 'info']),
        clearButtonId: PropTypes.string,
        disabled: PropTypes.bool,
        icon: PropTypes.func,
        onClear: PropTypes.func,
        onElementClick: PropTypes.func,
        position: PropTypes.oneOf(['left', 'right', 'static']),
        showClear: PropTypes.bool,
        buttonIcon: PropTypes.func
    }

    static defaultProps = {
        bsClass: 'icon-group',
        icon: null,
        clearButtonId: 'clearButton',
        position: 'left',
        buttonIconId: 'buttonIcon'
    }

    constructor(props, context) {
        super(props, context)

        this.handleClear = this.handleClear.bind(this)
        this.handleButtonIcon = this.handleButtonIcon.bind(this)
    }

    handleClear(e) {
        const { onClear } = this.props

        if (typeof onClear === 'function') {
            onClear(e)
        }
        else {
            // if uncontrolled, clear the wrapped input
            const inputs = Array.from(ReactDOM.findDOMNode(this).getElementsByTagName('input'))
            inputs.forEach(elem => {
                elem.value = ''
            })
        }
    }

    handleButtonIcon() {
        const { onElementClick } = this.props
        if (typeof onClear === 'function') {
            onElementClick()
        }
    }

    render() {

        const { buttonIconId, disabled, className, clearButtonId, children, buttonIcon, icon, onClear, onElementClick, position, showClear, ...props } = this.props // eslint-disable-line no-unused-vars
        // const [bsProps, elementProps] = utils.bootstrapUtils.splitBsProps(props)

        const classes = {
            'clearfix': true,
            'has-clear': !!showClear,
            'has-icon': !!icon,
            'has-btnIcon': !!buttonIcon
        }
        if (position) {
            classes[`position-${position}`] = true
        }
        const fullClassName = classNames(className, classes)

        const ButtonIcon = buttonIcon
        const IconComponent = icon
        const iconElem = icon ? (<IconComponent />) : null
        const clearButton = showClear ? (<Button className="clear-btn" id={clearButtonId} onClick={this.handleClear}>clear</Button>) : null
        const buttonElem = buttonIcon ? (<Button className="icon-btn" disabled={disabled} id={clearButtonId} onClick={this.handleButtonIcon}><ButtonIcon /></Button>) : null
        return (
            <span className={fullClassName} >
                {children}
                {iconElem}
                {clearButton}
                {buttonElem}
            </span>
        )
    }
}

export default IconGroup
