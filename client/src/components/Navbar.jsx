import React from 'react';

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">🎓</div>
            <span className="text-xl font-bold">AI Course Generator</span>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm">Welcome, {user.name}!</div>
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="bg-white text-blue-600 rounded-full w-10 h-10 flex items-center justify-center font-bold hover:bg-gray-200 transition"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-10">
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
