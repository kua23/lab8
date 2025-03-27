import { Link, Outlet } from 'react-router'; // Fix import

const Layout = () => {
  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Header */}
      <header className="bg-dark-dark shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Customer Portal
          </Link>
          <nav className="flex gap-6">
            <Link to="/" className="text-white hover:text-primary transition-colors">Home</Link>
            <Link to="/customers/view" className="text-white hover:text-primary transition-colors">Customers</Link>
            <Link to="/customers/create" className="text-white hover:text-primary transition-colors">New Customer</Link>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
