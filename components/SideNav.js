import Link from "next/link";
import { useRouter } from "next/router";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away-subtle.css";

import { Music, Clock, Edit3, Box, Edit, Radio } from "react-feather";

const JSXContent = ({ title }) => {
  return <strong style={{ fontSize: "1.8rem" }}>{title}</strong>;
};

const SideNav = () => {
  const router = useRouter();
  return (
    <div className="sidenav">
      <ul className="sidenav__list">
        <li
          className={`sidenav__item ${
            router.pathname === "/sounds" ? "active" : ""
          }`}
        >
          <Link href="/sounds">
            <a className="sidenav__link">
              <Tippy
                content={<JSXContent title="Ambient Sounds" />}
                placement="right-start"
                animation="shift-away-subtle"
                arrow={false}
              >
                <Music size={32} />
              </Tippy>
            </a>
          </Link>
        </li>
        <li
          className={`sidenav__item ${
            router.pathname === "/pomodoro" ? "active" : ""
          }`}
        >
          <Link href="/pomodoro">
            <a className="sidenav__link">
              <Tippy
                content={<JSXContent title="Pomodoro" />}
                placement="right-start"
                animation="shift-away-subtle"
                arrow={false}
              >
                <Clock size={32} />
              </Tippy>
            </a>
          </Link>
        </li>
        <li
          className={`sidenav__item ${
            router.pathname === "/todos" ? "active" : ""
          }`}
        >
          <Link href="/todos">
            <a className="sidenav__link">
              <Tippy
                content={<JSXContent title="Todos" />}
                placement="right-start"
                animation="shift-away-subtle"
                arrow={false}
              >
                <Edit3 size={32} />
              </Tippy>
            </a>
          </Link>
        </li>
        <li
          className={`sidenav__item ${
            router.pathname === "/timebox" ? "active" : ""
          }`}
        >
          <Link href="/timebox">
            <a className="sidenav__link">
              <Tippy
                content={<JSXContent title="Timebox" />}
                placement="right-start"
                animation="shift-away-subtle"
                arrow={false}
              >
                <Box size={32} />
              </Tippy>
            </a>
          </Link>
        </li>
        <li
          className={`sidenav__item ${
            router.pathname === "/notes" ? "active" : ""
          }`}
        >
          <Link href="/notes">
            <a className="sidenav__link">
              <Tippy
                content={<JSXContent title="Notes" />}
                placement="right-start"
                animation="shift-away-subtle"
                arrow={false}
              >
                <Edit size={32} />
              </Tippy>
            </a>
          </Link>
        </li>
        <li
          className={`sidenav__item ${
            router.pathname === "/lofi" ? "active" : ""
          }`}
        >
          <Link href="/lofi">
            <a className="sidenav__link">
              <Tippy
                content={<JSXContent title="Lo-fi Radio" />}
                placement="right-start"
                animation="shift-away-subtle"
                arrow={false}
              >
                <Radio size={32} />
              </Tippy>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideNav;
