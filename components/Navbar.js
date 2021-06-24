import Link from "next/link";
import { useState, useEffect, useRef } from "react";

import { useUser } from "@auth0/nextjs-auth0";
import { LogOut, User } from "react-feather";
import toast from "react-hot-toast";

const Navbar = () => {
  const [dropDown, setDropDown] = useState(false);
  const [offline, setOffline] = useState(false);
  const { user, isLoading } = useUser();
  const dropDownRef = useRef(null);

  const displayDropDown = () => {
    setDropDown((prevState) => !prevState);
  };

  const handleClickOutside = (e) => {
    if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
      setDropDown(false);
    }
  };

  const handleOffline = () => {
    toast.error("You're Offline !", {
      style: {
        fontSize: "2rem",
        fontWeight: "600",
        backgroundColor: "#212529",
        color: "#fff",
      },
    });
    setOffline(true);
    console.log("OFFLINE");
  };

  const handleOnline = () => {
    setOffline(false);
    console.log("ONLINE");
  };

  useEffect(() => {
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const Logo = () => {
    return (
      <Link href="/">
        <a className="navigation__logo">
          <span className="navigation__logo--main">
            flow
            <span className="navigation__logo--sub">.</span>
          </span>
        </a>
      </Link>
    );
  };

  const DropDown = () => {
    return (
      <div className="dropdown" ref={dropDownRef}>
        <div className="dropdown__header" onClick={displayDropDown}>
          <img
            src={user.picture}
            alt="profile-pic"
            className="dropdown__header-img"
            width="100%"
            height="100%"
          />
        </div>

        <div className={`dropdown__list ${dropDown ? "active" : ""}`}>
          <div className="dropdown__item">
            <a href="/account" className="dropdown__link">
              <User />
              <span className="dropdown__link-text">Account</span>
            </a>
          </div>

          <div className="dropdown__item">
            <a href="/api/auth/logout" className="dropdown__link">
              <LogOut />
              <span className="dropdown__link-text">Logout</span>
            </a>
          </div>
        </div>
      </div>
    );
  };

  const AuthNav = () => {
    return (
      <nav className="navigation">
        <Logo />
        <Link href="/tools">
          <a className="navigation__tools-btn">
            {offline ? "Offline" : "Tools"}
          </a>
        </Link>
        <DropDown />
      </nav>
    );
  };

  if (isLoading) {
    return (
      <nav className="navigation">
        <Logo />
      </nav>
    );
  }

  if (user) {
    return <AuthNav />;
  }

  return (
    <nav className="navigation">
      <Logo />
      <a href="/api/auth/login" className="navigation__login">
        <span className="navigation__login-text">Login</span>
      </a>
      <a href="/api/auth/login" className="navigation__signup">
        <span className="navigation__signup-text">Sign up</span>
      </a>
    </nav>
  );
};

export default Navbar;
