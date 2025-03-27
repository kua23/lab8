import { Link } from 'react-router';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-dark to-dark-dark text-white">
      <h1 className="text-5xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
        Customer Management System
      </h1>
      
      <div className="flex gap-6">
        <Link to="/customers/view" className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
          View All Customers
        </Link>
        <Link to="/customers/create" className="px-8 py-4 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
          Create New Customer
        </Link>
      </div>
    </div>
  );
}

export default App;
