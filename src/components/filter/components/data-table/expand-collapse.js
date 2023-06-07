import PropTypes from 'prop-types'
import React, { Component } from "react";
import { Button, Spinner, Row, Col, Panel } from "react-bootstrap";
import style from './expand-style.css'
import classNames from 'classnames';


export default class ExpanderButtonControl extends Component {
    static propTypes = {
        cssClassNames: PropTypes.shape({
            container: PropTypes.string,
            button: PropTypes.string
        }),
        expanded: PropTypes.bool
    }

    static defaultProps = {
        cssClassNames: {}
    }

    constructor(props) {
        super(props)
    }

    render() {

        const {
            children,
            eventKey,
            cssClassNames,
            expanded,
            ...otherProps
        } = this.props


        delete otherProps['className']

        const containerProps = {
            className: classNames(
                cssClassNames.container,
                'dropdown',
                'btn-group',
                { open: !expanded }
            )
        }
        const buttonProps = {
            className: classNames(
                'expanderButton',
                cssClassNames.button,
                'dropdown-toggle',
                'caret-left'
            ),
            ...otherProps
        }

        return (
            <div {...containerProps}>
                <Button {...buttonProps} bsStyle="link">
                    <span className="caret" />
                    {children}
                </Button>
            </div>
        )
    }
}