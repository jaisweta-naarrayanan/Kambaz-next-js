"use client";
import { Form, Button } from "react-bootstrap";

export default function Profile() {
  return (
    <div id="wd-profile-screen" className="p-4" style={{ maxWidth: "500px" }}>
      <h1 className="mb-4">Profile</h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-username">Username</Form.Label>
          <Form.Control
            id="wd-username"
            defaultValue="alice"
            placeholder="username"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-password">Password</Form.Label>
          <Form.Control
            id="wd-password"
            defaultValue="123"
            placeholder="password"
            type="password"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-firstname">First Name</Form.Label>
          <Form.Control
            id="wd-firstname"
            defaultValue="Alice"
            placeholder="First Name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-lastname">Last Name</Form.Label>
          <Form.Control
            id="wd-lastname"
            defaultValue="Wonderland"
            placeholder="Last Name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-dob">Date of Birth</Form.Label>
          <Form.Control
            id="wd-dob"
            type="date"
            defaultValue="2000-01-01"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-email">Email</Form.Label>
          <Form.Control
            id="wd-email"
            defaultValue="alice@wonderland.com"
            placeholder="Email"
            type="email"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-role">Role</Form.Label>
          <Form.Select id="wd-role" defaultValue="USER">
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>
            <option value="STUDENT">Student</option>
          </Form.Select>
        </Form.Group>

        <Button variant="danger" className="w-100">
          Signout
        </Button>
      </Form>
    </div>
  );
}