import { createBrowserRouter } from 'react-router';
import App from './App';
import CustomersList from './pages/CustomersList.tsx';
import CustomerView from './pages/CustomerView.tsx';
import CustomerForm from './pages/CustomerForm.tsx';
import Layout from './components/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/customers/view',
        element: <CustomersList />
      },
      {
        path: '/customers/view/:id',
        element: <CustomerView />
      },
      {
        path: '/customers/create',
        element: <CustomerForm />
      }
    ]
  }
]);

export default router;
