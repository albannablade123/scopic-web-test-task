const Navbar = () => {
  return (
    <>
      <nav className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <a href="/" className="text-white">
                  Logo
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="al-4 flex items-center space-x-4">
                <a
                  href="/products"
                  className="text-white hover:bg-white hover: text-black rounded-lg p-2"
                >
                  Item List
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
