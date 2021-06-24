import { useRouter } from "next/router";

import Navbar from "./Navbar";
import SideNav from "./SideNav";

const Layout = ({ children }) => {
  const router = useRouter();

  let sideNavComponent;

  switch (router.pathname) {
    case "/":
    case "/tools":
    case "/account":
    case "/404":
      sideNavComponent = null;
      break;
    default:
      sideNavComponent = <SideNav />;
  }

  return (
    <div className="content">
      <Navbar />
      {sideNavComponent}
      {children}
    </div>
  );
};

export default Layout;
