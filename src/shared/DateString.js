import moment from 'moment'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

const DateString = ({ timestamp }) => {
  const [dateObj, setDateObj] = useState()
  useEffect(() => {
    const responseDate = moment(timestamp * 1000)
    setDateObj({
      date: responseDate.format('DD'),
      month: responseDate.format('MMM'),
      year: responseDate.format('YYYY'),
      time: responseDate.format('h:mm:ss a')
    })
  }, [timestamp])

  return (
    dateObj?.date && (
      <div>
        <h4 className='mt-2'>
          {dateObj?.date} {dateObj?.month}, {dateObj?.year}
        </h4>
        <strong>{dateObj?.time}</strong>
      </div>
    )
  )
}

DateString.propTypes = {
  timestamp: PropTypes.number
}

export default DateString
