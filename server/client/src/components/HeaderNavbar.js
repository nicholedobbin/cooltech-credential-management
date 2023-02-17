import React from 'react';

// Import Bootstrap components.
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function HeaderNavbar({ isLoggedIn }) {
  return (
    <Navbar bg="light" expand="lg" fixed="top">
      <Container>
        {/* If the user is logged in, set the navbar brand's href to the dashboard endoint. 
            Else, set it to "/" to show login page (i.e. localhost:3000/). */}
        {isLoggedIn ?
          <a href="#dashboard" className="navBarBrand py-2">
            CoolTech Credentials Manager
          </a> :
          <a href="/" className="navBarBrand py-2">
            CoolTech Credentials Manager
          </a>}

        {/* Toggle links to collapsible hamburger on small viewports */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {/* When lthe user is logged in, display a logout link with href set to "/". This logs the 
              (user out and sets the browser url back to the login page (i.e. localhost:3000/). */}
            {isLoggedIn && <a href="/" className="navBarText py-2">Logout</a>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
