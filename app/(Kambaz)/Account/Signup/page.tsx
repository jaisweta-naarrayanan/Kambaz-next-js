import Link from "next/link";
import { Form, Button } from "react-bootstrap";

export default function Signup() {
  return (
    <div id="wd-signup-screen" className="p-4" style={{ maxWidth: "400px" }}>
      <h1 className="mb-4">Sign up</h1>
      <Form>
        <Form.Control
          defaultValue="john_doe"
          placeholder="username"
          className="wd-username mb-2"
        />
        <Form.Control
          placeholder="password"
          type="password"
          className="wd-password mb-2"
        />
        <Form.Control
          placeholder="verify password"
          type="password"
          className="wd-password-verify mb-3"
        />
        <Link href="/Account/Profile" passHref legacyBehavior>
          <Button
            as="a"
            variant="primary"
            className="w-100 mb-2"
          >
            Sign up
          </Button>
        </Link>
        <Link href="/Account/Signin">Sign in</Link>
      </Form>
    </div>
  );
}