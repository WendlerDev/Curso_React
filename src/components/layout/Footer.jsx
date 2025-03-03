import React from 'react';
import { Container } from 'reactstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container className="text-center">
        <p className="mb-0">BetTracker &copy; {new Date().getFullYear()} - Track your daily challenges with friends</p>
      </Container>
    </footer>
  );
};

export default Footer;