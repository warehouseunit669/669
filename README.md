# 669 Project

This project is a web application built with React and Firebase. It includes various components and pages to provide a comprehensive user experience. The project is configured to deploy on Firebase Hosting.

## Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Features](#features)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Deployment](#deployment)
- [Firebase Configuration](#firebase-configuration)
- [Additional Information](#additional-information)

## Project Overview
This project is a single-page application (SPA) built using React, a popular JavaScript library for building user interfaces. The application leverages Firebase for its backend services, including authentication, Firestore database, and hosting. By using Firebase, the project eliminates the need for a traditional backend server, simplifying the architecture and reducing the maintenance overhead.

## Project Structure
### Directory and File Descriptions
```
- **.github/workflows/**: Contains GitHub Actions workflows for CI/CD.
  - `firebase-hosting-merge.yml`: Workflow for deploying to Firebase Hosting on merge to the main branch.
  - `firebase-hosting-pull-request.yml`: Workflow for deploying to a preview channel on pull request.

- **public/**: Contains static assets and the main HTML file.
  - `index.html`: The main HTML file for the application.
  - `assets/images/`: Directory for storing image assets.

- **src/**: Contains the source code of the application.
  - **assets/images/**: Directory for storing image assets used in the application.
  - **components/**: Contains reusable React components.
    - `CardHeader.jsx`: Component for card headers.
    - `EquipmentCard.jsx`: Component for displaying equipment information.
    - `FilesListCard.jsx`: Component for displaying a list of files.
    - `ListTemplate.jsx`: Template component for lists.
    - `LoginCard.jsx`: Component for the login card.
    - `MakatimCard.jsx`: Component for displaying Makatim information.
  - **css/**: Contains CSS files for styling.
    - `styles.css`: Main stylesheet for the application.
  - **help_functions/**: Contains utility functions.
    - `utility.js`: Utility functions used across the application.
  - **pages/**: Contains React components for different pages.
    - `HomePage.jsx`: Component for the home page.
    - `LoginPage.jsx`: Component for the login page.
    - `DashboardPage.jsx`: Component for the dashboard page.
  - `App.jsx`: Main application component.
  - `AuthContext.jsx`: Context for authentication.
  - `AuthProvider.jsx`: Provider component for authentication context.
  - `firebase-config.jsx`: Firebase configuration file.
  - `main.jsx`: Entry point for the React application.

- **.eslintrc.cjs**: ESLint configuration file.
- **.firebaserc**: Firebase project configuration file.
- **.gitignore**: Specifies files and directories to be ignored by Git.
- **.prettierrc**: Prettier configuration file.
- **firebase.json**: Firebase configuration file.
- **package.json**: Contains project metadata and dependencies.
- **README.md**: Project documentation.
- **vite.config.js**: Vite configuration file.
```

## Features

- **React**: The project is built using React for a dynamic and responsive user interface.
- **Firebase**: Utilizes Firebase for authentication, Firestore for database, and Firebase Hosting for deployment.
- **Component-Based Architecture**: The project is organized into reusable components.
- **CI/CD**: Continuous Integration and Continuous Deployment are set up using GitHub Actions.

## Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/your-username/669-project.git
    cd 669-project
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

## Running the Project

To start the development server, run:
```sh
npm run dev
```
This will start the Vite development server and you can view the application at http://localhost:3000.

## Deployment
The project is configured to deploy on Firebase Hosting. The deployment process is automated using GitHub Actions.

### Deploy on Merge to Main
The workflow defined in .github/workflows/firebase-hosting-merge.yml will deploy the application to Firebase Hosting when changes are merged into the main branch.

### Deploy on Pull Request
The workflow defined in .github/workflows/firebase-hosting-pull-request.yml will deploy the application to a preview channel on Firebase Hosting when a pull request is created.

## Firebase Configuration
The Firebase configuration is defined in src/firebase-config.jsx. Ensure you have the correct Firebase project settings:
```sh
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID",
};
```

## Additional Information
### Why No Backend Server?
The decision to use Firebase instead of a traditional backend server was made to leverage the following benefits:

- Scalability: Firebase automatically scales with your application, handling increased traffic without requiring manual intervention.
- Real-time Database: Firestore provides real-time data synchronization, which is ideal for applications that require live updates.
- Authentication: Firebase Authentication offers a secure and easy-to-implement solution for managing user sign-in and sign-up processes.
- Hosting: Firebase Hosting provides fast and secure static hosting for web applications, with built-in support for SSL and CDN.
- Cost-Effective: Firebase offers a generous free tier and pay-as-you-go pricing, making it cost-effective for small to medium-sized projects.

### Technologies Used
- React: For building the user interface.
- Firebase: For backend services including authentication, Firestore database, and hosting.
- Vite: For fast and optimized development build.
- GitHub Actions: For continuous integration and continuous deployment (CI/CD).
By using these technologies, the project aims to provide a robust, scalable, and maintainable solution for building modern web applications.
