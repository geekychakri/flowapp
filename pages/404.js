import Link from "next/link";

export default function Custom404() {
  return (
    <div className="error-page">
      <img src="/img/404.svg" alt="" width="250" height="250" />
      <p className="error-page__msg">The aliens are here !</p>
      <Link href="/">
        <a className="error-page__btn">Escape</a>
      </Link>
    </div>
  );
}
