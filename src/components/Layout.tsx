
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart3, 
  Building2, 
  Warehouse, 
  TrendingUp, 
  Settings, 
  LogOut,
  Home
} from 'lucide-react';

const Layout: React.FC = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getNavItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
      { icon: TrendingUp, label: 'Suggestions', path: '/suggestions' },
    ];

    if (profile?.role === 'store_manager') {
      baseItems.push({ icon: Building2, label: 'My Store', path: `/stores/${profile.linked_store_id}` });
    } else if (profile?.role === 'warehouse_manager') {
      baseItems.push({ icon: Warehouse, label: 'My Warehouse', path: `/warehouses/${profile.linked_warehouse_id}` });
    } else if (profile?.role === 'admin') {
      baseItems.push(
        { icon: Building2, label: 'Stores', path: '/stores' },
        { icon: Warehouse, label: 'Warehouses', path: '/warehouses' },
        { icon: Settings, label: 'Admin', path: '/admin' }
      );
    }

    return baseItems;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">NeuraChain</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {profile?.email} ({profile?.role?.replace('_', ' ')})
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {getNavItems().map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center px-3 py-4 text-sm font-medium text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-colors"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
