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
      year: responseDate.format('YYYY')
    })
  }, [timestamp])
  return (
    <div>
      <h4>
        {dateObj?.date}, {dateObj?.month}
      </h4>
      <h4>{dateObj?.year}</h4>
    </div>
  )
}

DateString.propTypes = {
  timestamp: PropTypes.number
}

export default DateString
