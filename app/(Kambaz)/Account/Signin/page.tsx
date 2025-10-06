"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";

export default function Signin() {
  const router = useRouter();

  const handleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/Account/Profile");
  };

  return (
    <div id="wd-signin-screen" className="p-4" style={{ maxWidth: "400px" }}>
      <h1 className="mb-4">Sign in</h1>
      <Form>
        <Form.Control
          id="wd-username"
          placeholder="username"
          className="mb-2"
        />
        <Form.Control
          id="wd-password"
          placeholder="password"
          type="password"
          className="mb-3"
        />
        <Button
          id="wd-signin-btn"
          variant="primary"
          className="w-100 mb-2"
          onClick={handleSignIn}
        >
          Sign in
        </Button>
        <Link id="wd-signup-link" href="/Account/Signup">
          Sign up
        </Link>
      </Form>
    </div>
  );
}