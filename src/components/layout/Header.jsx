import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, Button, Container } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logoutUser, getCurrentUser } from '../../utils/auth';

const Header = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <Navbar color="dark" dark expand="md" className="mb-4">
      <Container>
        <NavbarBrand tag={Link} to={authenticated ? '/home' : '/login'}>
          BetTracker
        </NavbarBrand>
        <Nav className="ms-auto" navbar>
          {authenticated ? (
            <>
              <NavItem className="d-flex align-items-center text-light me-3">
                Welcome, {currentUser?.name || 'User'}
              </NavItem>
              <NavItem>
                <Button color="light" outline onClick={handleLogout}>
                  Logout
                </Button>
              </NavItem>
            </>
          ) : (
            <NavItem>
              <Button color="light" outline tag={Link} to="/login">
                Login
              </Button>
            </NavItem>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;