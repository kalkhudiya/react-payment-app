import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './home/Home'
import InitPayment from './payment/InitPayment'
import ListPayment from './payment/ListPayment'
import PaymentStatus from './payment/PaymentStatus'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/payment',
    element: <InitPayment />
  },
  {
    path: '/payment-status',
    element: <PaymentStatus />
  },
  {
    path: '/payment-list',
    element: <ListPayment />
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
