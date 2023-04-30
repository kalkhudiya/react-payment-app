import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center'>
      <h1 className='display-4'>Welcome to custom payment app</h1>
      <div>
        <img
          alt='payment-app-image'
          src='https://cdn-icons-png.flaticon.com/512/6037/6037575.png'
        />
      </div>
      <Link to={'payment'}>Make a payment</Link>
      &nbsp;|&nbsp;
      <Link to={'payment-list'}>Transaction list</Link>
    </div>
  )
}

export default Home
