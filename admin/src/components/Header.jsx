import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Header() {

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    window.location.href = '/'; // Redirect to login page
  };

  return (
    <React.Fragment>
      {['lg'].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-white mb-3 shadow-sm">
          <Container>
            <Navbar.Brand href="#">BAS Admin Panel</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Offcanvas
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1">
                  <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/blogs">Blogs</Nav.Link>
                  <Nav.Link as={Link} to="/articles">Articles</Nav.Link>
                  <NavDropdown title="Events" id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/events">Events</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/events/event-booking">Event Booking</NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link as={Link} to="/members">Members</Nav.Link>
                  <Nav.Link as={Link} to="/gallery">Gallery</Nav.Link>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </React.Fragment>
  );
}

export default Header;