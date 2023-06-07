import { dateToString } from '../components/date-picker/dateFormater'
import { getDateOfWeek } from '../components/date-picker/dateFormater'

export const months = () => {
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
}

export const weeks = () => {
    const brandDates = []
    for (let i = 1; i <= 52; i++) {
        brandDates.push(`week ${i}`)
    }

    brandDates.map(item => {
        const split = item.split(' ')
        const week = split[1]
        const getdate = getDateOfWeek(week)
        const startdate = dateToString(getdate)
        return startdate
    })

    return brandDates
}