# **MERN Stack Web App for Credential Management.**

## **IFS L4T35 - Capstone Project 5: Authentication**

## **Description**
This is a full-stack web application that uses the MERN stack (MongoDB, Express, React & Node) to manage Cool Tech's (a hypothetical tech company) user credentials. 

Users (i.e. employees) can login to the app or register a new user, and perform CRUD operations to create, read and update credential repositories, as well as assign or unassign users from Organisational Units and Divisions in the database, depending on their role.

### **Database Info** ###
CoolTech's database consists of two collections: 
1. **organisationalunits**
    * This collection contains data for Cool Tech's four Organisational Units (OUs). 
    * Each OU has at least 10 different Divisions within them, and each Division has its own Credentials Repository, which contains a list of login details for various places within the Division.
    * Each OU contains a list of users (i.e. employees) assigned to the OU, and each Division within the OU contains a list of users assigned to it.
    * Users can be assigned to an OU without being assigned to any Divisions in the OU, but they cannot be assigned to a Division if they are not assigned to its parent OU. 
    * This means that if a user is assigned to an OU only, they have access to the OU but cannot access the Divisions within it. When a user is assigned to an OU and one of its Divisions, they have access to the OU, the Division, and the Credentials Repo for that Division.
    * Most employees are only part of one OU and one Division within it, but there are some that are part of more than one OU and Division, based on their role in the company. 

2. **users**
    * This collection contains the list of users (i.e. employees) in the company, with their username, password and role.
    * There are three types of user roles:
        1. Normal Users: 
            - can read the Credential Repository for the Division they're assigned to.
            - can add new credentials to the repository.
        2. Management Users: 
            - have the same permissions as Normal users.
            - can also update credentials.
        3. Admin Users: 
            - have the same permissions as Management and Normal users.
            - can assign and unassign users from OUs and Divisions (when they are unassigned from an OU, they are also unassigned from all of its Divisions).
            - can change user roles.

### **Authentication & CRUD Operations** ###
1. Login or Register new users:
    - new users are registered with a Normal role by default.
    - authentication of users' role determines what is displayed on their dashboard (i.e. they only see what they have access to).
2. Show all OU's, Divisions and Crednetial Repositories the user is assigned to.
3. Add new credentials to a Credential Repository (Normal, Management and Admin).
4. Update existing credentials in a Credential Repository (Management and Admin).
5. Assign and unassign users from OUs and Divisions (Admin).
6. Change user roles  (Admin).

## What's happening in the back-end (Node.js/Express/MongoDB/Mongoose)?
The [server.js](/server/server.js) file contains the URL paths for the authentication and CRUD operations, and gets its callback functions from the [organisationalUnit.controller.js](/server/controllers/organisationalUnit.controller.js) and [user.controller.js](/server/controllers/user.controller.js) files, which contains the functionality for performing authentication and CRUD operations on the database. These files get their models/schema from the [user.js](/server/models/user.js), [organisationalUnit.js](/server/models/organisationalUnit.js), and [newCredential.js](/server/models/newCredential.js) files.

## What's happening in the front-end (React)?
The [App.js](/server/client/src/App.js) file and [components](/server/client/src/components/) files contain all the front end logic for storing data from the backend in state and displaying the data based on user authentication and request parameters. It gets input from the user for the CRUD operations and sends this to the backend to to update the database.

<hr>

## **Installation and Setup**
1. Clone the repo and open with your preferred IDE (e.g. VSCode).
2. In the command line, navigate to the *server* folder and install the dependencies: `npm install`
3. Open a new/split terminal window and navigate to the *client* folder and install the dependencies: `npm install`
4. In the *server* folder, run the project's server: `npm start`
5. In the *client* folder, run the project's server: `npm start`
6. This should open the React app in your browser automatically. You can also navigate to http://localhost:3000/

**Note:**
This app uses an *.env* file to protect sensitive data. You'll need to set up and create your own connections and JWT in your MongoDB database and replace the ones in this project with your own.
<hr>

## **How To Use**
1. Login or Register a new user. Once logged in, the dashboard displays OUs and Divisions the user has access to and allows CRUD permissions based on the user's role. 
2. In the Dashboard's OU Cards (left column):
    - view OU and Division details in the Overview tab.
    - view, add or edit credentials in the Credential Repos tab, by clicking on their respective buttons in their tables and completing the form that displays on click.
    - unassign users in the OU Users and Division Users tabs, by clicking on their respective buttons in their tables.
3. In the Dashboard's Users Cards (right column):
    - view list of users in the Users List tab.
    - change user roles in the Manage Users tab, by completing the form in the dropdown menu.
    - assign users to OUs and Divisions in the Manage Users tab, by completing the form in the dropdown menu.

<hr>

## **Credit and References**
Made by [Nichole Dobbin](https://github.com/nicholedobbin), for my [HyperionDev](https://www.hyperiondev.com/) course.