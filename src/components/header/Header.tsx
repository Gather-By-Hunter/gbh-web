import { SmallLogo } from "@components/index.ts";
import { Link } from "react-router-dom";
import { useState, useEffect, type ReactNode, useContext } from "react";
import { User, Menu, X } from "lucide-react";
import { AuthContext } from "@context/index.ts";

const NavLink = ({
  to,
  children,
  closeMenu,
}: {
  to: string;
  children: ReactNode;
  closeMenu?: () => void;
}) => (
  <Link
    to={to}
    className="group text-gbh-black hover:text-gbh-gold transition-colors text-5xl md:text-xl font-montserrat-light"
    onClick={closeMenu}
  >
    <span className="relative inline-block">
      {children}
      <span className="absolute bottom-0 left-0 w-full h-px bg-gbh-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-center -mb-1 overflow-x-hidden"></span>
    </span>
  </Link>
);

const UserIcon = ({ onClick }: { onClick?: () => void }) => {
  const { user } = useContext(AuthContext);

  return (
    <Link
      to={user ? "/account" : "/register"}
      className="p-2 rounded-full transition-colors border border-gbh-black hover:bg-gbh-gold"
      onClick={onClick}
    >
      <User
        size={24}
        strokeWidth={1.5}
        className="text-gbh-black cursor-pointer"
      />
    </Link>
  );
};

const Divider = () => <div className="h-6 w-px bg-gbh-black" />;

export const Header = () => {
  const [percentScrolled, setPercentScrolled] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const max = window.outerHeight / 2;

      if (window.scrollY >= max) setPercentScrolled(1);
      else if (Math.abs(window.scrollY / max - percentScrolled) > 0.05)
        setPercentScrolled(window.scrollY / max);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-gbh-cream flex items-center justify-between h-20 px-12 sticky top-0 z-50 transition-all duration-300 shadow-lg">
      <div className="flex items-center">
        <Link to="/">
          <SmallLogo
            style={{
              height: `calc(var(--spacing) * ${14 * (percentScrolled + 1)})`,
            }}
            className="rounded-full transition-all duration-300 bg-gbh-cream"
          />
        </Link>
      </div>
      <nav className="hidden md:flex items-center space-x-3 lg:space-x-6">
        <NavLink to="/match-your-vibe">Match Your Vibe</NavLink>
        <Divider />
        <NavLink to="/collections">Collections</NavLink>
        <Divider />
        <NavLink to="/gallery">Gallery</NavLink>
        <Divider />
        <NavLink to="/about-us">About Us</NavLink>
      </nav>
      <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
        <UserIcon />
        <Divider />
        <Link
          to="/cart"
          className="bg-gbh-green border-gbh-black text-gbh-white px-6 py-2 rounded-md hover:bg-gbh-gold transition-colors font-montserrat-light"
        >
          Cart
        </Link>
      </div>
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(true)}>
          <Menu size={24} className="text-gbh-black" />
        </button>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-gbh-cream z-50">
          <div className="flex justify-end p-5">
            <button onClick={closeMenu}>
              <X size={24} className="text-gbh-black" />
            </button>
          </div>
          <nav className="flex flex-col items-center space-y-8 mt-10">
            <NavLink to="/match-your-vibe" closeMenu={closeMenu}>
              Match Your Vibe
            </NavLink>
            <NavLink to="/collections" closeMenu={closeMenu}>
              Collections
            </NavLink>
            <NavLink to="/gallery" closeMenu={closeMenu}>
              Gallery
            </NavLink>
            <NavLink to="/about-us" closeMenu={closeMenu}>
              About Us
            </NavLink>
            <div className="flex items-center space-x-4 pt-8">
              <UserIcon onClick={closeMenu} />
              <Divider />
              <Link
                to="/cart"
                className="bg-gbh-green border-gbh-black text-gbh-white px-6 py-2 rounded-md hover:bg-gbh-gold transition-colors font-montserrat-light"
                onClick={closeMenu}
              >
                Cart
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
