"use client";
import { Button, Card, Nav, NavItem, NavLink } from "react-bootstrap";

export default function BootstrapNavigation() {
  return (
    <div id="wd-css-navigating-with-tabs">
      <h2>Tabs</h2>
      <Nav variant="tabs">
        <NavItem>
          <NavLink href="#/Labs/Lab2/Active">Active</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/Labs/Lab2/Link1">Link 1</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/Labs/Lab2/Link2">Link 2</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/Labs/Lab2/Disabled" disabled>Disabled</NavLink>
        </NavItem>
      </Nav>
      <div id="wd-css-navigating-with-cards">
        <h2>
          Cards
        </h2>
        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src="/images/stacked.jpg" />
          <Card.Body>
            <Card.Title>Stacking Starship</Card.Title>
            <Card.Text>
              Stacking the most powerful rocket in history. Mars or bust!
            </Card.Text>
            <Button variant="primary">Boldly Go</Button>
          </Card.Body>
        </Card>
      </div>


    </div>
  );
}