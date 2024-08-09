"use client";
import { headers } from "next/headers";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NotificationsDropdown from "./components/NotificationDropdown";

const Navbar = () => {
  const [auth, setAuth] = useState(false);
  const [notification, setNotification] = useState([]);
  const [userId, setUserId] = useState(null); // To store the authenticated user ID
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user", {
          credentials: "include",
        });

        const content = await response.json();
        if (content.id) {
          // User is authenticated and logged out
          setUserId(content.id);
          setIsAdmin(content.is_admin);
          setAuth(true);
        }
      } catch (e) {
        setAuth(false);
      }
      console.log(auth);
    })();
  });

  useEffect(() => {
    if (auth) {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/notification?user_id=${userId}`,
            {
              credentials: "include",
            }
          );

          const notificationsContent = await response.json();
          setNotification(notificationsContent["notifications"]);
        } catch (e) {
          console.error("Error fetching notifications:", e);
        }
      };

      fetchNotifications();
    }
  }, [auth, userId]);

  const toggleDropdown = () => {
    console.log("REACHED EHRE");
    setIsDropdownOpen(!isDropdownOpen);
  };

  const logout = async () => {
    await fetch("http://localhost:8000/api/logout", {
      method: "POST", // Correctly specify the method here
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Ensure cookies are sent with the request
    });

    await router.push("/login");
    setAuth(false);
  };

  let menu;

  if (auth) {
    menu = (
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <div className="flex-shrink-0">
          <a className="text-white italic font-bold">
              Antique Auction
            </a>
            <a
              href="/products"
              className="text-white hover:bg-white hover: text-black rounded-lg p-2 ml-3"
            >
              Item List
            </a>

            <Link
              className="text-white hover:bg-white hover: text-black rounded-lg p-2 ml-3"
              href={{
                pathname: "/configuration",
                query: {
                  search: "search",
                  userId: userId,
                },
              }}
            >
              auto-bid configuration
            </Link>
            {isAdmin && (
              <a
                href="/admin/products"
                className="text-white hover:bg-white hover: text-black rounded-lg p-2 ml-3"
              >
                Admin Dashboard
              </a>
            )}
          </div>
        </div>
        <div className="hidden md:block">
          <div className="al-4 flex items-center space-x-4 relative inline-block">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault(); // Prevent default link behavior
                toggleDropdown(); // Toggle dropdown visibility
              }}
              className="text-white hover:bg-slate-800 hover: text-black rounded-lg p-2"
            >
              Notifications
            </a>
            {isDropdownOpen && (
              <NotificationsDropdown
                notifications={notification}
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
              />
            )}
            <a
              href="#"
              onClick={logout}
              className="text-white hover:bg-slate-800 hover: text-black rounded-lg p-2"
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    );
  } else {
    menu = (
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <a href="/" className="text-white italic font-bold">
              Antique Auction
            </a>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="al-4 flex items-center space-x-4">
            <Link
              href="/login"
              className="text-white hover:bg-slate-800: text-black rounded-lg p-2"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <nav className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{menu}</div>
      </nav>
    </>
  );
};

export default Navbar;
