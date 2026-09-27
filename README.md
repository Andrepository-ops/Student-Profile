# Student Profile App (Cordova)
Earl Andre H. Valmorida - ITCC 41 A


## Features

View and edit profile details 
Capture a profile photo using the device camera cordova-plugin-camera
Profile data and photo persist locally via `localStorage`
Responsive layout for desktop, tablet, and mobile


## Tech Stack

- Apache Cordova (Android platform)
- HTML5, CSS3, Bootstrap 5
- cordova-plugin-camera

## Project Structure


index.html          
index.js            
about.html          
skills.html          
projects.html        
contact.html         
header-sync.js   Syncs header name/photo across non-index pages
style.css            
profile.png           


## Running the App

cordova platform add android
cordova build android
cordova run android

Requires a connected Android device or emulator with Cordova camera support.

## Screenshots


Profile View
![Profile view](screenshots/Profile-1.png)

### Edit Profile
![Edit profile form](screenshots/Profile-2.png)
![Edit profile form](screenshots/Profile-3.png)

### Profile with new photo
![Edit profile form](screenshots/Profile-4.png)



