import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled components
const NavbarContainer = styled.nav`
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.8), rgba(0, 123, 255, 0.6));
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
`;

const NavbarBrand = styled(Link)`
  color: #000; /* Black color */
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  transition: text-shadow 0.3s ease;

  &:hover {
    text-shadow: 0 0 20px #009999, 0 0 30px #009999; /* Darker cyan glow */
  }
`;

const NavbarTogglerIcon = styled.span`
  background-color: #fff;
`;

const NavbarNavLink = styled(Link)`
  color: #000; /* Black color */
  font-size: 1rem;
  padding: 10px 15px;
  text-decoration: none;
  transition: text-shadow 0.3s ease; /* Apply text-shadow luminify effect */

  &:hover {
    text-shadow: 0 0 20px #009999, 0 0 30px #009999; /* Darker cyan glow */
  }
`;

const BtnLink = styled.button`
  color: #000 !important; /* Black color */
  text-decoration: none;
  font-weight: bold;
  background: none;
  border: none;
  transition: text-shadow 0.3s ease;

  &:hover {
    text-shadow: 0 0 20px #009999, 0 0 30px #009999; /* Darker cyan glow */
  }
`;

const Navbar = () => {
    const navigate = useNavigate();
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const handleLogout = () => {
        // Remove user data from local storage
        localStorage.removeItem('user');
        // Redirect to landing page
        navigate('/');
    };

    return (
        <NavbarContainer className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid">
                <NavbarBrand to="/">TecnoVínculo</NavbarBrand>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <NavbarTogglerIcon className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <NavbarNavLink to="/dashboard">Dashboard</NavbarNavLink>
                        </li>
                    </ul>
                    {user ? (
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <BtnLink className="nav-link" onClick={handleLogout}>
                                    {user.username} Logout
                                </BtnLink>
                            </li>
                        </ul>
                    ) : (
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <NavbarNavLink to="/login">Login</NavbarNavLink>
                            </li>
                            <li className="nav-item">
                                <NavbarNavLink to="/register">Register</NavbarNavLink>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </NavbarContainer>
    );
};

export default Navbar;