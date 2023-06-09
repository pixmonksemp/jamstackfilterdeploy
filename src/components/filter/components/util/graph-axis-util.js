export const graphLegendMarkerColorsPalette = [
    '#0ecdd8', '#e5712a', '#feb019', '#ff4560', '#008ffb', '#00e396', '#775dd0',
    '#f205e6', '#1c0365', '#14a9ad', '#4ca2f9', '#a4e43f', '#d298e2', '#6119d0',
    '#d2737d', '#c0a43c', '#f2510e', '#651be6', '#79806e', '#61da5e', '#cd2f00',
    '#9348af', '#01ac53', '#c5a4fb', '#996635', '#b11573', '#4bb473', '#75d89e',
    '#2f3f94', '#2f7b99', '#da967d', '#34891f', '#b0d87b', '#ca4751', '#7e50a8',
    '#c4d647', '#e0eeb8', '#11dec1', '#289812', '#566ca0', '#ffdbe1', '#2f1179',
    '#935b6d', '#916988', '#513d98', '#aead3a', '#9e6d71', '#4b5bdc', '#0cd36d',
    '#250662', '#cb5bea', '#228916', '#ac3e1b', '#df514a', '#539397', '#880977',
    '#f697c1', '#ba96ce', '#679c9d', '#c6c42c', '#5d2c52', '#48b41b', '#e1cf3b',
    '#5be4f0', '#57c4d8', '#a4d17a', '#225b8', '#be608b', '#96b00c', '#088baf',
    '#f158bf', '#e145ba', '#ee91e3', '#05d371', '#5426e0', '#4834d0', '#802234',
    '#6749e8', '#0971f0', '#8fb413', '#b2b4f0', '#c3c89d', '#c9a941', '#41d158',
    '#fb21a3', '#51aed9', '#5bb32d', '#807fb', '#21538e', '#89d534', '#d36647',
    '#7fb411', '#0023b8', '#3b8c2a', '#986b53', '#f50422', '#983f7a', '#ea24a3',
    '#79352c', '#521250', '#795548', '#0d5ac1'
]

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