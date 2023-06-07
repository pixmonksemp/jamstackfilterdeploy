export function emailFieldValidation(email) {
    if (!email) {
        return null
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function IsValidFields(value) {
    return !value ? false : true
}

export function passwordValidation(value) {
    if (!value) {
        return false
    }
    return value && value.length >= 1
}

export function passwordFieldValid(value) {
    const minlength = value.length >= 6
    const maxlength = value.length <= 18
    const alpha = /([a-zA-Z])/.test(value)
    const numeric = /([0-9])/.test(value)
    const isValid = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9\S]{6,18})$/.test(value)

    if (!value) {
        return [false, 'This is a required field']
    }
    if (isValid) {
        return [true, null]
    }
    else {
        if (!minlength) {
            return [false, 'Password should contain minimum of 6 character']
        }
        if (!maxlength) {
            return [false, 'Password should not exceed maximum of 18 character']
        }
        if (!alpha) {
            return [false, 'Password should contain atleast 1 alphabetic character']
        }
        if (!numeric) {
            return [false, 'Password should contain atleast 1 numeric value']
        }
    }
}