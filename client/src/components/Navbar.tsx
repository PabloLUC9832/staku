import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏃</span>
              <h1 className="text-xl font-bold">Runners Manager</h1>
            </div>

            <div className="flex space-x-4">
              <Link
                  to="/"
                  className={`px-4 py-2 rounded-lg transition-colors ${
                      isActive('/')
                          ? 'bg-white text-blue-600 font-semibold'
                          : 'hover:bg-blue-700'
                  }`}
              >
                Ver Corredores
              </Link>
              <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-lg transition-colors ${
                      isActive('/admin')
                          ? 'bg-white text-blue-600 font-semibold'
                          : 'hover:bg-blue-700'
                  }`}
              >
                Panel Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>
  );
};