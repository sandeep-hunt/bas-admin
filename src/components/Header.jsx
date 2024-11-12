import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ProfileDropDown from './ProfileDropDown';


function Header() {

  const userData = JSON?.parse( localStorage.getItem('userData'));
  const profile_name = userData?.user_name?.split("");

  const handleLogout = () => {

    window.localStorage.clear();
    setTimeout(() => {
      window.location.href = '/';
     },0);

    // localStorage.removeItem('token'); // Clear the token
    // window.location.href = '/'; // Redirect to login page
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
                  <Nav.Link as={Link} to="/category">Category</Nav.Link>
                  <Nav.Link as={Link} to="/blogs">Blogs</Nav.Link>
                  <Nav.Link as={Link} to="/articles">Articles</Nav.Link>
                  <NavDropdown title="Events" id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/events">Events</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/events/event-booking">Event Booking</NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link as={Link} to="/members">Members</Nav.Link>
                  <Nav.Link as={Link} to="/gallery">Gallery</Nav.Link>
                  <Nav.Link as={Link} to="/messages">Messages</Nav.Link>
                  {/* <Nav.Link onClick={handleLogout}>Logout</Nav.Link> */}
                  <div className=' relative flex group cursor-pointer'>
                      <div className=' relative p-1 min-w-[40px] min-h-[40px] rounded-full bg-[#007bff]  text-[#FFFFFF] text-lg font-medium leading-4 text-center flex justify-center items-center'>
                        <p className='-mt-1 uppercase'>{profile_name?.[0]}</p>
                      </div>
                      <div className='absolute right-0 z-[1100] top-10  hidden group-hover:block '>
                        <ProfileDropDown/>
                      </div>
                  </div>
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