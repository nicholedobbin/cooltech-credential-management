import React, { useState, useEffect } from 'react';

// Import components.
import OuCard from './OuCard';
import AddRepoForm from './AddRepoForm';
import EditRepoForm from './EditRepoForm';
import UsersCard from './UsersCard';

// Import Bootstrap components.
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Dashboard({ isLoggedIn, userData, ouData, setOuData, allUsersData, setAllUsersData }) {
    // ---------- Set states ----------
    // For storing OU data from forms (in OuCard, AddRepoForm and EditRepoForm components).
    const [formOuName, setFormOuName] = useState();
    const [formDivisionName, setFormDivisionName] = useState();
    const [formRepoName, setFormRepoName] = useState();

    // For displaying addRepoForm and editRepoForm (in OuCard, AddRepoForm and EditRepoForm components).
    const [showAddRepoForm, setShowAddRepoForm] = useState();
    const [showEditRepoForm, setShowEditRepoForm] = useState();

    // For displaying error messages.
    const [error, setError] = useState();

    // ---------- User Token ----------
    // Store token for CRUD requests' Authorization Headers.
    const userToken = userData.token;

    // ---------- Use Effect ----------
    // Gets all OU Data the user has access to on first load.
    useEffect(() => {
        const getAllOrgUnits = async () => {
            // Store requset options for GET OUs request.
            const requestOptions = {
                method: 'GET',
                headers: {
                    Authorization: userToken
                }
            }

            // Send GET OUs request to endpoint.
            const response = await fetch('/organisational-units', requestOptions);

            //  Store JSON data from response.
            const jsonData = await response.json();

            // If there is an error with the fetch request, set error state to jsonData.
            if (!response.ok) {
                setError(jsonData);
            }

            // If there is no error with the fetch request, set error state to null 
            // and set ouData to the jsonData. 
            if (response.ok) {
                setError(null);
                setOuData(jsonData);
            }
        }
        getAllOrgUnits();
    }, [setOuData, setError, userToken])


    // If ouData contains data and the user is logged in, return the dashboard containing  
    // a welcome message with cards for OU/User data and forms, based on the user's role.
    if (isLoggedIn && ouData) {
        return (
            <div id="dashboard" className="my-5 py-3">
                {/* ---------- Error Message container ---------- */}
                {/* Displays error message if there's an error with the GET OUs request. */}
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

                {/* ---------- Welcome container ---------- */}
                <Container fluid className="pt-5">
                    <Row >
                        <Col>
                            <h1 className="display-6">Welcome to your dashboard, {userData.username}.</h1>
                            <p className="text-muted py-2 fs-4">Role: {ouData.role}</p>
                        </Col>
                    </Row>
                </Container>

                {/* ---------- Cards and Forms container ---------- */}
                <Container fluid >
                    <Row className="mx-5">

                        {/* --- OU Data column --- */}
                        <Col sm={7}>
                            <div className="cardContainer">
                                {/* OU Data Card (with divisions and credential repos). */}
                                <OuCard
                                    ouData={ouData}
                                    userData={userData}
                                    setOuData={setOuData}
                                    setFormOuName={setFormOuName}
                                    setFormDivisionName={setFormDivisionName}
                                    setFormRepoName={setFormRepoName}
                                    setShowAddRepoForm={setShowAddRepoForm}
                                    setShowEditRepoForm={setShowEditRepoForm}
                                />
                            </div>
                        </Col>

                        {/* --- Forms and Users Data column --- */}
                        <Col sm={5} id="formsColumn">
                            {/* Users Data Card for Admin only. */}
                            <UsersCard
                                ouData={ouData}
                                setOuData={setOuData}
                                userData={userData}
                                allUsersData={allUsersData}
                                setAllUsersData={setAllUsersData}
                            />

                            {/* Add New Credential Repo Form. */}
                            <AddRepoForm
                                userData={userData}
                                ouData={ouData}
                                setOuData={setOuData}
                                formOuName={formOuName}
                                setFormOuName={setFormOuName}
                                formDivisionName={formDivisionName}
                                setFormDivisionName={setFormDivisionName}
                                setFormRepoName={setFormRepoName}
                                showAddRepoForm={showAddRepoForm}
                                setShowAddRepoForm={setShowAddRepoForm}
                            />

                            {/* Update Credential Repo Form. */}
                            <EditRepoForm
                                userData={userData}
                                ouData={ouData}
                                setOuData={setOuData}
                                formOuName={formOuName}
                                setFormOuName={setFormOuName}
                                formDivisionName={formDivisionName}
                                setFormDivisionName={setFormDivisionName}
                                formRepoName={formRepoName}
                                setFormRepoName={setFormRepoName}
                                showEditRepoForm={showEditRepoForm}
                                setShowEditRepoForm={setShowEditRepoForm}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
