import Link from "next/link";

export default function AccountNavigation() {
  return (
    <div id="wd-account-navigation" className="list-group fs-5 rounded-0">
      <Link
        href="/Account/Signin"
        className="list-group-item border-0 text-danger"
      >
        Signin
      </Link>
      <Link
        href="/Account/Signup"
        className="list-group-item border-0 text-danger"
      >
        Signup
      </Link>
      <Link
        href="/Account/Profile"
        className="list-group-item border-0 text-danger"
      >
        Profile
      </Link>
    </div>
  );
}