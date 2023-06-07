import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

let optionsArray = []
export default class CheckBox extends React.Component {

    static propTypes = {
        id: PropTypes.string,
        isValid: PropTypes.bool,
        isInvalid: PropTypes.bool,
        defaultChecked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
        checked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
        disabled: PropTypes.bool,
        inline: PropTypes.bool,
        type: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        bsPrefix: PropTypes.string,
        label: PropTypes.string,
        title: PropTypes.string,
        onChange: PropTypes.func,
        className: PropTypes.string,
        searchTableCallBack: PropTypes.func,
        isFilterApplied: PropTypes.bool,
        isCleared: PropTypes.bool
    };

    static defaultProps = {
        disabled: false,
        inline: false,
        isValid: false,
        isInvalid: false,
        type: 'checkbox'
    };

    constructor(props) {
        super(props);
        const checked = 'checked' in props ? props.checked : props.defaultChecked;
        this.state = {
            checked
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps, prevProps) {
        if (nextProps.isFilterApplied || nextProps.isCleared) {
            this.setState({ checked: false })
            optionsArray = []
        }
    }

    handleChange = (item) => {
        var action = item.target.checked
        var label = item.target.value
        this.setState({ checked: action })
        for (let key in optionsArray) {
            if (optionsArray[key].name == label) {
                delete optionsArray[key]
            }
        }
        let selectedValue = { name: label, status: action }
        optionsArray.push(selectedValue)
        this.props.searchTableCallBack(optionsArray)
    };

    render() {
        const {
            type,
            disabled,
            bsPrefix,
            label,
            title,
            className,
            checked
        } = this.props;

        return (
            <Form.Group controlId="formBasicChecbox" className="overall">
                <Form.Check
                    id={label}
                    className={className}
                    disabled={disabled}
                    type={type}
                    onChange={(item) => this.handleChange(item)}
                    bsPrefix={bsPrefix}
                    label={label}
                    title={title}
                    checked={this.state.checked}
                    value={label}
                />
            </Form.Group>
        );
    }
}
