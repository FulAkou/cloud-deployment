import React from "react";
import { Button, Container, Form, FormControl, Navbar } from "react-bootstrap";

const AppNavbar = ({ onSearch, onAddNote }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="p-3" sticky="top">
      <Container>
        <Navbar.Brand href="#">NotesApp</Navbar.Brand>
        <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
          <FormControl
            type="search"
            placeholder="Rechercher..."
            className="me-2"
            aria-label="Search"
            onChange={(e) => onSearch(e.target.value)}
          />
          <Button variant="outline-success" type="button">
            Rechercher
          </Button>
        </Form>
        <Button variant="primary" className="ms-3" onClick={onAddNote}>
          Ajouter une note
        </Button>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
