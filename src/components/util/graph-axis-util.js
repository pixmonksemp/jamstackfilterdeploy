export const getGraphAxisValueFormatter = (val) => {
    if (val < 1e3) {
        return Math.round(val)
    }

    if (val >= 1e3 && val < 1e5) {
        let thousands = val / 1e3
        return thousands.toFixed(1) + ' ' + 'K'
    }

    if (val >= 1e5 && val < 1e6) {
        let lakhs = val / 1e3
        return lakhs.toFixed(1) + ' ' + 'K'
    }

    if (val >= 1e6 && val < 1e8) {
        let crore = val / 1e6
        return crore.toFixed(1) + ' ' + 'M'
    }

    if (val >= 1e9)
        return '100Cr+'
}