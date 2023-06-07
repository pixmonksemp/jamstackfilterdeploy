import React from 'react';
import DatePickerControl from './datePickerController';

class DatePickerControlContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '2019-12-18'
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(value) {
    }

    render() {
        return (
            <div>
                <div>
                    <DatePickerControl
                        onChange={this.onChange}
                        value={this.state.value}
                    />
                </div>
                <div>
                </div>
            </div>
        );
    }
}

export default DatePickerControlContainer;