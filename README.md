# Valmorida_StudentProfile
  Earl Andre H. Valmorida - ITCC41 A

## Project Description

This is a mobile Student Profile application built with Apache Cordova. It started as a static profile site (Activities 2–6) showcasing personal information, skills, and projects. In Activity 7, the application evolved into a database-driven, authenticated application**: profile data is no longer hard-coded in the app but is stored in a SQLite database and served through a Node.js/Express backend API. Users must log in before they can view or edit their profile, and all changes are persisted to the database.

## Application Pages

- Profile 
- About
- Skills 
- Projects 
- Contact 
- Login 

## Authentication
Users authenticate with a Student ID and password on the Login page.


On successful login, the backend verifies the password against a securely hashed value stored in the database and issues a JSON Web Token (JWT). This token is stored on the device and sent with every subsequent request to prove the user is authenticated. If the token is missing, invalid, or expired, the user is redirected back to the Login page and must sign in again.

## Student Profile Management

Once authenticated, a student can:

- View their profile  
- Edit their information
- Save changes 
- Update their profile picture
- Log out 

## Database Integration

Database technology: SQLite, accessed through Node's built-in node:sqlite module.

The database consists of two related tables:

- users – stores each student's unique Student ID and hashed password.
- profile – stores the profile data associated with each Student ID:
  - Student ID
  - Name
  - Course
  - Year Level
  - About Me
  - Skills
  - Profile Picture 

## API/Backend

The Cordova application never talks to the database directly. Instead, it communicates with a Node.js/Express backend API over HTTP, and the backend is the only component that touches the database.


The frontend sends requests with the session token included in the Authorization header. The backend verifies the token, executes the appropriate database operation, and returns a JSON response.

## CRUD Operations

- Create – A new student account and profile record are created (via the account seeding process / registration).
- Read – GET /api/profile retrieves and displays the authenticated student's profile data from the database.
- Update – PUT /api/profile updates the student's Name, Course, Year Level, About Me, Skills, and/or Profile Picture in the database.
- Delete – DELETE /api/profile/test-record demonstrates the delete operation on a designated test account, rather than an actual student account, since deleting a real user's data would not be appropriate for this demonstration.

## Camera Integration

The Cordova Camera plugin functionality from Activity 6 is retained. When a student selects Change Profile Picture, the device camera opens, captures an image, and converts it to a base64 data URI. That image is then sent to the backend as part of a profile update request, so the new picture is stored in the database and tied to that student's profile — rather than only existing temporarily on the device.

## Data Persistence

Because profile information is stored in the database rather than in local variables or local storage, changes persist across sessions:


Only the session token is kept in local storage on the device, the actual profile data is always re-fetched from the database after login, so closing the app, restarting it, or logging out and back in will always show the latest saved information.

##Responsive Design

The application uses Bootstrap 5's responsive grid system and custom CSS with relative units and flexible layouts. Page sections reflow from a single column on mobile devices to multi-column layouts on tablets and desktops, and the navigation bar wraps and adjusts spacing at smaller screen widths so the application remains usable on phones, tablets, and desktop browsers alike.

## Security

- Passwords are never stored as plain text — they are hashed using bcrypt before being saved to the database.
- Authentication is handled entirely on the backend; the Cordova application never has direct access to the database or its credentials.
- Session state is managed with short-lived JWTs rather than persistent passwords being resent on every request.
- Sensitive configuration  is stored in a `.env` file that is excluded from the Git repository via .gitignore. Only a placeholder .env.example is committed.
- Database credentials and secrets are never exposed to, or embedded in, the Cordova frontend code.

## How to Run

Backend/API:
1. Navigate to the server folder.
2. Copy .env.example to .env and fill in your own values.
3. Install dependencies: npm install
4. Seed the database with test accounts: npm run seed
5. Start the server: npm start
   The API will run at http://localhost:3000.

Cordova Application:
1. Ensure auth.js points to the correct API address:
   - Desktop browser testing: http://localhost:3000 works as-is.
   - Physical device/emulator: replace with your computer's LAN IP, e.g. http://192.168.1.20:3000.
2. Install project dependencies as needed for your Cordova setup.
3. Build the application for your target platform.
4. Run the application on an emulator, device, or browser

## Test Accounts

The following accounts are seeded for demonstration purposes only and are not real student accounts:

Student ID &  Password 

 TEST-0001  Test1234! 


## Application Screenshots

 Login/Logout page
![db1.png](db1.png)

 Successful login
![db2.png](db2.png)

 Student Profile
![db2.png](db2.png)

 Edit Profile
![db3.png](db3.png)

 Updated Profile
![db4.png](db4.png)

