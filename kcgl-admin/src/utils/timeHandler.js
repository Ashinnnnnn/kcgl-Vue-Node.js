import dayjs from 'dayjs'

//把时间转为日期格式
export const timeToDate = (row, column, value) => {
  return dayjs(value).format('YYYY-MM-DD')
}
