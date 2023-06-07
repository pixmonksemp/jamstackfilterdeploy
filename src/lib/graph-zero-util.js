import moment from 'moment'
import extend from 'extend'
import { getDateOfWeek } from '../../src/components/date-picker/dateFormater'
import { dateToString } from '../../src/components/date-picker/dateFormater'
let defaultMonthDataList = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  date = new Date(),
  currentMonth = defaultMonthDataList[date.getMonth()],
  currentWeek = moment().week(),
  currentMonthIndex = defaultMonthDataList.indexOf(currentMonth),
  defaultInvenotryWeeklyDataList = [],
  defaultInvenotryWeeklyValueList = []

let previousMonthsToCheck = moment(date).subtract(3, 'month')
let subractedWeek = moment(previousMonthsToCheck).week()

/**
 * This method is to check whether the data of incoming week doesnt exceed current date
 */
function getDefaultValueList(i, defaultValue) {
  let dateByWeekNumber = getDateOfWeek(i)
  let endDatevalue = moment(dateByWeekNumber).format('YYYY-MM-DD')
  let startDateValue = moment(date).format('YYYY-MM-DD')
  let startDate = moment(startDateValue)
  let endDate = moment(endDatevalue)
  if (endDate.isSameOrBefore(startDate)) {
    defaultValue.push(0)
  }
}

/**
 * This method is used to check whether the data of month doesnt exceed current date
 */
export function getMonthList(monthList) {
  let today = new Date()
  let convertedDate = moment(today).subtract(3, 'month')
  let endDateValue = moment(today).format('YYYY-MM-DD')
  let startDateValue = moment(convertedDate).format('YYYY-MM-DD')
  let startDate = moment(startDateValue)
  let endDate = moment(endDateValue)
  while (startDate.isSameOrBefore(endDate)) {
    monthList.push(startDate.format('MMMM'))
    startDate.add(1, 'month')
  }
}

/**
 * This method is used to get week list depends on params
 * @param dayIndex (0-6 sun-sat)
 * @param weekCount-no of weeks
 * startDate - set starting date of the current year
 * currentDate -set the  year till date
 */
export function getWeekList(dayIndex, weekCount) {
  let startDate = new Date('1/1/' + moment().year()),
    currentDate = moment()._d,
    j = 1,
    ArrayOfWeek = [] 

  for (let i = 0; startDate <= currentDate; i += j) {
    if (startDate.getDay() == dayIndex) {
      const startDateValue = dateToString(startDate)
      ArrayOfWeek.push(startDateValue)
      startDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      j = 7
    } else {
      j = 1
      startDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
    }
  }
  return ArrayOfWeek.slice(Math.max(ArrayOfWeek.length - weekCount, 1))
}
for (let i = 1; i <= currentWeek; i++) {
  if (i >= subractedWeek) defaultInvenotryWeeklyDataList.push(`week ${i}`)
}

for (let i = 1; i <= currentWeek; i++) {
  if (i >= subractedWeek) {
    getDefaultValueList(i, defaultInvenotryWeeklyValueList)
  }
}

/**
 * This util method is used set the default graph data point to zero
 * for months per year which does not has a data point value in the database.
 * @param {*} monthlySearchChartData - Trend Monthly Graph Data
 * @alias - Search Insights
 * @author - PIXMONKS DEVELOPER
 * @returns - Zero formatted data
 */
export function getSearchTrendMonthlyZeroFormattedGraph(
  monthlySearchChartData
) {
  let zeroFormattedResponse = []
  let extendedMonthlyGrapfDataObj
  let searchFormattedGraphDataObj = {
    name: '',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }

  for (let name in monthlySearchChartData) {
    extendedMonthlyGrapfDataObj = extend(
      true,
      {},
      searchFormattedGraphDataObj,
      {}
    )
    extendedMonthlyGrapfDataObj.name = name

    for (let monthlySearchChartType in monthlySearchChartData[name]) {
      for (let monthlySearchformattedChartDataObj in monthlySearchChartData[
        name
      ][monthlySearchChartType]) {
        defaultMonthDataList.map((month, index) => {
          if (month === monthlySearchformattedChartDataObj) {
            extendedMonthlyGrapfDataObj.data[index] =
              monthlySearchChartData[name][monthlySearchChartType][
                monthlySearchformattedChartDataObj
              ]
          }
        })
      }
    }
    extendedMonthlyGrapfDataObj.data = extendedMonthlyGrapfDataObj.data.slice(
      currentMonthIndex - 3,
      currentMonthIndex + 1
    )
    zeroFormattedResponse.push(extendedMonthlyGrapfDataObj)
  }
  return zeroFormattedResponse
}

/**
 * This util method is used set the default graph data point to zero
 * for weeks per year which does not has a data point value in the database.
 * @param {*} weeklySearchChartData - Trend Weekly Graph Data
 * @alias - Search Insights
 * @author - PIXMONKS DEVELOPER
 * @returns - Zero formatted data
 */
export function getSearchTrendWeeklyZeroFormattedGraph(weeklySearchChartData,lastScrapWeek) {
  let zeroFormattedResponse = []
  let extendedWeeklyGrapfDataObj
  let defaultWeeklyFridayDataList = [],
    defaultWeeklyFridayValueList = []

  for (let i = 1; i <= lastScrapWeek; i++) {
    if (i >= subractedWeek) {
      defaultWeeklyFridayDataList.push(`W${i}`)
    }
  }

  for (let i = 1; i <= lastScrapWeek; i++) {
    if (i >= subractedWeek) {
      getDefaultValueList(i, defaultWeeklyFridayValueList)
    }
  }
  
  let formattedChartWeeklyDataObj = {
    name: '',
    weeks: defaultWeeklyFridayDataList,
    data: defaultWeeklyFridayValueList
  }
  for (let name in weeklySearchChartData) {
    extendedWeeklyGrapfDataObj = extend(
      true,
      {},
      formattedChartWeeklyDataObj,
      {}
    )
    extendedWeeklyGrapfDataObj.name = name
    for (let weeklySearchChartType in weeklySearchChartData[name]) {
      for (let weekValue in weeklySearchChartData[name][
        weeklySearchChartType
      ]) {
        const splittedWeekValue = weekValue.split('-')
        defaultWeeklyFridayDataList.map((week, index) => {
          if (
            week === splittedWeekValue[0] &&
            splittedWeekValue[1] !== 'sops'
          ) {
            extendedWeeklyGrapfDataObj.data[index] =
              weeklySearchChartData[name][weeklySearchChartType][weekValue]
          }
        })
      }
    }
    zeroFormattedResponse.push(extendedWeeklyGrapfDataObj)
  }

  return zeroFormattedResponse
}

/**
 * This util method is used set the default graph data point to zero
 * for months per year which does not has a data point value in the database.
 * @param {*} monthlyData - Trend Monthly Graph Data For Non Search Trends Module
 * @author - PIXMONKS DEVELOPER
 * @returns - Zero formatted data
 */
export function getMonthlyZeroFormattedGraphData(monthlyData) {
  let zeroFormattedResponse = []
  let extendedMonthlyGrapfDataObj
  let monthlyGraphDataObj = {
    name: '',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }

  for (let name in monthlyData) {
    extendedMonthlyGrapfDataObj = extend(true, {}, monthlyGraphDataObj, {})
    extendedMonthlyGrapfDataObj.name = name
    for (let monthValue in monthlyData[name]) {
      defaultMonthDataList.map((month, index) => {
        if (month === monthValue) {
          extendedMonthlyGrapfDataObj.data[index] = parseInt(
            monthlyData[name][monthValue]
          )
        }
      })
    }

    extendedMonthlyGrapfDataObj.data = extendedMonthlyGrapfDataObj.data.slice(
      currentMonthIndex - 3,
      currentMonthIndex + 1
    )
    zeroFormattedResponse.push(extendedMonthlyGrapfDataObj)
  }

  return zeroFormattedResponse
}

/**
 * This util method is used set the default graph data point to zero
 * for weeks per year which does not has a data point value in the database.
 * @param {*} weeklyData - Trend Monthly Graph Data For Non Search Trends Module
 * @author - PIXMONKS DEVELOPER
 * @returns - Zero formatted data
 */
export function getWeeklyZeroFormattedGraphData(weeklyData) {
  let zeroFormattedResponse = []
  let extendedWeeklyGrapfDataObj
  let weeklyGraphDataObj = {
    name: '',
    weeks: defaultInvenotryWeeklyDataList,
    data: defaultInvenotryWeeklyValueList
  }

  for (let name in weeklyData) {
    extendedWeeklyGrapfDataObj = extend(true, {}, weeklyGraphDataObj, {})
    extendedWeeklyGrapfDataObj.name = name
    for (let weekValue in weeklyData[name]) {
      defaultInvenotryWeeklyDataList.map((week, index) => {
        if (week === weekValue) {
          extendedWeeklyGrapfDataObj.data[index] = parseInt(
            weeklyData[name][weekValue]
          )
        }
      })
    }
    zeroFormattedResponse.push(extendedWeeklyGrapfDataObj)
  }

  return zeroFormattedResponse
}

/**
 * This util method is used set the default graph data point to zero
 * for months per year which does not has a data point value in the database.
 * @param {*} monthlyData - List of sales trend data
 * @author - PIXMONKS DEVELOPER
 * @returns - Zero formatted data
 */
export function getSKUMonthlyZeroFormattedGraphData(monthlyData) {
  let skuFormattedDataObj = { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }

  monthlyData.map(data => {
    defaultMonthDataList.map((month, index) => {
      if (month === data.month) {
        skuFormattedDataObj.data[index] = data.salesValue
      }
    })
  })

  if (skuFormattedDataObj.data.length) {
    skuFormattedDataObj.data.splice(currentMonthIndex + 1, 11)
    return skuFormattedDataObj
  }
}
