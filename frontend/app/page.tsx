"use client";
import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./globals.css"; // Ensure to import global CSS

const App = () => {
  return (
    <main>
      <nav
        className="navbar bg-dark border-bottom border-body"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            CryptoETP
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="/login">
                  Login
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/sign_up">
                  Sign Up
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container text-center pt-5 pb-5">
        <h1 className="pb-2 text-light">CryptoETP</h1>
        <h3 className="text-light">
          The only platform you need to learn how to trade!
        </h3>
        <div className="pt-4">
          <a
            className="button1 btn btn-light btn-lg"
            href="/sign_up"
            role="button"
          >
            Start your journey
          </a>
        </div>
      </div>
      <Container className="section pt-5 ps-5">
        <Row>
          <Col xs>
            <Card style={{ width: "18rem" }} className="text-bg-dark">
              <Card.Img variant="top" src="1.jpg" />
              <Card.Body>
                <Card.Title>
                  Trading Education: Navigating the Markets with Knowledge
                </Card.Title>
                <Card.Text>
                  In the world of trading, education is the compass that guides
                  success. Understanding market dynamics, risk management, and
                  psychological factors is crucial. It's not just about theory
                  but also practical experience and learning from mistakes. Now
                  you can do this without losing your money and learning from
                  the real market.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={{ order: 12 }}>
            <Card style={{ width: "18rem" }} className="text-bg-dark">
              <Card.Img variant="top" src="2.jpg" />
              <Card.Body>
                <Card.Title>The cryptocurrencies</Card.Title>
                <Card.Text>
                  In our platform you can find the most populat cryptocurrencies
                  to trade with and learn how to keep track of them. You will
                  also learn how to make profit from them by parcticing and not
                  being worried if you are going to lose your money.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={{ order: 1 }}>
            <Card style={{ width: "18rem" }} className="text-bg-dark">
              <Card.Img variant="top" src="3.jpg" />
              <Card.Body>
                <Card.Title>Our platform</Card.Title>
                <Card.Text>
                  CryptoETP is your go-to platform for mastering cryptocurrency
                  trading by using money that isn't yours, so that you can
                  actually learn how to trade without being worried, but
                  altought , don't forget to be reasonable and not to take too
                  much risk.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default App;
