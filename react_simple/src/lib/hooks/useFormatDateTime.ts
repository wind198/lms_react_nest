import dayjs, { ConfigType } from 'dayjs'

export default function useFormatDateTime() {
  const formatDateCommon = (v: ConfigType) => {
    return dayjs(v).format('DD/MM/YYYY')
  }
  const formatDateTimeCommon = (v: ConfigType) => {
    return dayjs(v).format('DD/MM/YYYY HH:mm')
  }

  const getFriendlyMonthName = (monthNumber: number) => {
    // Validate the month number input to be between 1 and 12
    if (monthNumber < 1 || monthNumber > 12) {
      throw new Error('Month number must be between 1 and 12')
    }

    // Create a Day.js date object for the first day of the given month
    const date = dayjs(new Date(2000, monthNumber - 1, 1))

    // Format the date to get the full month name
    return date.format('MMMM')
  }

  return { getFriendlyMonthName, formatDateCommon, formatDateTimeCommon }
}
