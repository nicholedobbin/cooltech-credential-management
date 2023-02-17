import React, { useState } from 'react';

// Import Boostrap components.
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Login({ setUserData, setIsLoggedIn }) {

    // ---------- Set States ----------
    // For for login/register credentials.
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // For error messages.
    const [error, setError] = useState();

    // Boolean state for switching between login and register forms.
    const [signIn, setSignIn] = useState(true);

    // ---------- Handle Login ----------
    const handleLogin = async (e) => {
        // Prevent default page reload.
        e.preventDefault();

        // Create object to store inputted user credentials.
        let userCredentials = {
            username: username,
            password: password
        }

        // Store request options for POST Login request.
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userCredentials)
        }

        // Send POST Login request to endpoint.
        const response = await fetch('/login', requestOptions);

        // Store JSON data from response.
        const jsonData = await response.json();

        // If there is an error with the fetch request, set error state to jsonData.
        if (!response.ok) {
            setError(jsonData);
        }

        // If there is no error with the fetch request:
        if (response.ok) {
            // If the response.message includes the string 'Incorrect login!':
            if (jsonData.message.includes('Incorrect login!')) {
                // Set error state to the jsonData's message/ 
                setError(jsonData.message);

                // Set timeout for error message to stop displaying after 3 seconds.
                setTimeout(() => {
                    setError(null)
                }, 3000);

                // Set isLoggedIn to false.
                setIsLoggedIn(false);

            } else {
                // Else, set error state to null, set isLoggedIn to true and set User data to the jsonData.
                setError(null);
                setIsLoggedIn(true);
                setUserData(jsonData);
            }
        }
    }

    // ---------- Handle Register ----------
    const handleRegister = async (e) => {
        // Prevent default page reload.
        e.preventDefault();

        // Create object to store inputted user credentials.
        let userCredentials = {
            username: username,
            password: password
        }

        // Store request options for POST Register request.
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userCredentials)
        }

        // POST Register request endpoint.
        const response = await fetch('/register', requestOptions);

        // Store JSON login data from response.
        const jsonRegisterData = await response.json();

        // If there is an error with the fetch request, set error state to jsonData.
        if (!response.ok) {
            setError(jsonRegisterData);
        }

        // If there is no error with the fetch request:
        if (response.ok) {
            // If the jsonRegisterData's success key is false:
            if (!jsonRegisterData.successKey) {
                // Set error state to the error's message.
                setError(jsonRegisterData.message);

                // Set timeout for error message to stop displaying after 3 seconds.
                setTimeout(() => {
                    setError(null)
                }, 3000);
            }

            // If the json data's success key is true: 
            if (jsonRegisterData.successKey) {
                // Set error state to null, logged in state to true and userdata to the jsonData.
                setError(null);
                setIsLoggedIn(true);
                setUserData(jsonRegisterData);
            }
        }
    }

    // If signIn state is true, return the login form. 
    if (signIn) {
        return (
            <div className="py-5 my-5" id="login">
                <Container className="loginForm mx-auto w-50">
                    <p className="text-center my-3 py-3 fw-bold" > Please login to your account:</p>
                    {/* Login Form */}
                    <Form onSubmit={handleLogin}>

                        {/* Username input */}
                        <Form.Group as={Row} className="justify-content-center" controlId="formUsername">
                            <Form.Label column sm={3}>Username:</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    onChange={e => setUsername((e.target.value))}
                                    value={username}
                                />
                            </Col>
                        </Form.Group>

                        {/* Password input */}
                        <Form.Group as={Row} className="my-3 pt-2 justify-content-center" controlId="formPassword">
                            <Form.Label column sm={3}>Password:</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="text"
                                    name="password"
                                    onChange={e => setPassword(e.target.value)}
                                    value={password}
                                />
                            </Col>
                        </Form.Group>

                        {/* Log in button and Register option */}
                        <Form.Group as={Row} className="my-3 justify-content-center" >
                            <Col sm={{ span: 6 }}>
                                <Button type="submit" className="my-4 loginButton">LOG IN</Button>
                                <p onClick={() => setSignIn(false)}>Register</p>
                                {/* When error state is true, display error message below button. */}
                                {error &&
                                    <Container className="error border border-danger border-2">
                                        <Row>
                                            <Col className="text-end">
                                                <p className="closeMessageButton" onClick={() => setError(null)}>
                                                    close
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <p>{error}</p>
                                            </Col>
                                        </Row>
                                    </Container>
                                }
                            </Col>
                        </Form.Group>
                    </Form>
                </Container >
            </div>
        )
    } else {
        // Else (i.e. if signIn state is false), return the register form.
        return (
            <div className="py-5 my-5">
                <Container className="loginForm mx-auto w-50">
                    <p className="text-center my-3 py-3 fw-bold">Register your new account:</p>
                    {/* Register Form */}
                    <Form onSubmit={handleRegister}>

                        {/* Username input */}
                        <Form.Group as={Row} className="my-3 justify-content-center" controlId="formUsername">
                            <Form.Label column sm={3}>Username:</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    onChange={e => setUsername(e.target.value)}
                                    value={username}
                                />
                            </Col>
                        </Form.Group>

                        {/* Password input */}
                        <Form.Group as={Row} className="my-3 pt-2 justify-content-center" controlId="formPassword">
                            <Form.Label column sm={3}>Password:</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="text"
                                    name="password"
                                    onChange={e => setPassword(e.target.value)}
                                    value={password}
                                />
                            </Col>
                        </Form.Group>

                        {/* Register button and Log in option */}
                        <Form.Group as={Row} className="my-3 justify-content-center" >
                            <Col sm={{ span: 6 }}>
                                <Button type="submit" className="my-4 loginButton">REGISTER & LOG IN</Button>
                                <p onClick={() => setSignIn(true)}>Log in with existing account</p>
                                {/* When error state is true, display error message below button. */}
                                {error &&
                                    <Container className="error border border-danger border-2">
                                        <Row>
                                            <Col className="text-end">
                                                <p className="closeMessageButton" onClick={() => setError(null)}>
                                                    close
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <p>{error}</p>
                                            </Col>
                                        </Row>
                                    </Container>
                                }
                            </Col>
                        </Form.Group>
                    </Form>
                </Container >
            </div>
        )
    }
}
