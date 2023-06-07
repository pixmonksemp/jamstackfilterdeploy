import React from "react";
import Select from "react-select";

export default function CustomSelect({ onChange, options, value, name, className = "" }) {
    
    const defaultValue = (options, value) => {
        return options ? options.find((option) => option.id === value) : "";
    };

    return (
        <div>
            <Select
                className={className}
                isClearable={true}
                name={name}
                value={defaultValue(options, value)}
                onChange={(value,action) => {
                    onChange(value);
                }}
                options={options}
            />
        </div>
    );
}