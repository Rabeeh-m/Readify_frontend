# Readify Frontend

This repository contains the frontend for Readify, a web application for managing personal book collections and reading lists. It is built with React and uses Vite as the build tool.

## Features
- User authentication (login, register)
- Book browsing and PDF viewing
- Reading list management with drag-and-drop ordering
- Responsive UI for desktop and mobile

## Prerequisites
- **Node.js** (18.x or higher) and **npm** (8.x or higher)
- **Git** (for cloning the repository)
- A running instance of [Readify Backend](https://github.com/<your-username>/Readify_backend)

## Setup Instructions

### 1. Clone the Repository
  ```bash
  git clone https://github.com/<your-username>/Readify_frontend.git
  cd Readify_frontend
  ```

### 2. Install Dependencies
  ```bash
  npm install
  ```
### 3. Configure API Base URL
 ```bash
  axios.defaults.baseURL = 'http://127.0.0.1:8000/api/';
  ```

### 4. Run the Development Server
  ```bash
  npm run dev
  ```

## Contributing
-  Fork the repository.
-  Create a feature branch (git checkout -b feature-name).
-  Commit changes (git commit -m "Add feature").
-  Push to the branch (git push origin feature-name).
-  Open a pull request
