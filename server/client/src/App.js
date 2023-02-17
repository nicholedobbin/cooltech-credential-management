import React, { useState } from 'react';

// Import stylesheet.
import './App.css';

// Import components.
import HeaderNavbar from './components/HeaderNavbar';
import Login from './components/Login';
import Dashboard from "./components/Dashboard";

function App() {
  // Set global states for login, OU and User data.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState();
  const [ouData, setOuData] = useState();
  const [allUsersData, setAllUsersData] = useState();

  return (
    <div className="App mx-5">
      {/* Navbar component. */}
      <HeaderNavbar
        isLoggedIn={isLoggedIn}
      />

      {/* If isLoggedIn state is true, display the Dashboard component, else, display the Login component. */}
      {isLoggedIn ? (
        <Dashboard
          isLoggedIn={isLoggedIn}
          userData={userData}
          ouData={ouData}
          setOuData={setOuData}
          allUsersData={allUsersData}
          setAllUsersData={setAllUsersData}
        />
      ) : (
        <Login
          setIsLoggedIn={setIsLoggedIn}
          setUserData={setUserData}
        />)}

    </div>
  );
}

export default App;
