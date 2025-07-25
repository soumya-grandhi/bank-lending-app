# Bank Lending System

A full-stack banking loan management system built with React (frontend), Node.js with Express (backend), and SQLite for persistent data storage.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Frontend Components](#frontend-components)
- [Project Structure](#project-structure)
- [Styling](#styling)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This application simulates a basic banking loan system, allowing customers to create loans, make payments (EMI or lump sum), view loan ledgers (transaction history and status), and get an overview of all loans per customer.

---

## Features

- **Loan Management:** Create loans linked to customers.
- **Payments:** Record EMI or lump sum payments against loans.
- **Ledger:** View detailed transaction history for loans.
- **Customer Overview:** Aggregate view of all loans for a customer.
- **Data Persistence:** Uses SQLite (`bank.db`) for persistent storage.
- **API-Driven:** RESTful endpoints served by Express.js backend.
- **User-Friendly Frontend:** React class components with routing and form validation.
- **Responsive and Clean UI:** Consistent styling across all pages.

---

## Technology Stack

| Layer      | Technology                      |
|------------|--------------------------------|
| Frontend   | React.js (Class Components)    |
| Routing    | React Router DOM v6             |
| Backend    | Node.js, Express.js             |
| Database   | SQLite3                        |
| Styling    | CSS                            |
| Version Control | Git, GitHub                 |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
- Git (for version control)
- SQLite CLI (optional, for inspecting `bank.db`)
  
### Installation

1. Clone the repo:
   
git clone https://github.com/soumya-grandhi/bank-lending-app.git
cd bank-lending-app

2. Install backend dependencies (from your project root):
npm install


3. Ensure you have the database file `bank.db`. It will be auto-created if missing when you run the backend.

4. Install frontend dependencies (if frontend is in a separate folder, navigate accordingly):
   
npm install


---

### Running the Project

#### Backend

Start the Express server:

node index.js

(Or use `nodemon` for auto-restarts during dev.)

The backend listens on (default):

http://localhost:3000/api/v1


#### Frontend

Start the React app:

npm start

Access your app via:

http://localhost:3000


---

## API Endpoints

| Function                        | Endpoint                               | Method | Description                          |
|--------------------------------|--------------------------------------|--------|------------------------------------|
| Create Loan                    | `/api/v1/loans`                      | POST   | Create a new loan                   |
| Record Payment                 | `/api/v1/loans/{loan_id}/payments`  | POST   | Record EMI or lump sum payment      |
| View Loan Ledger               | `/api/v1/loans/{loan_id}/ledger`    | GET    | View loan details and transaction history |
| Customer Account Overview      | `/api/v1/customers/{customer_id}/overview` | GET | View all loans and summary for a customer |

---

## Frontend Components

- **LoanForm:** Create a new loan linked to a customer.
- **PaymentForm:** Record payments against loans.
- **LoanLedger:** View loan details and transaction history.
- **CustomerOverview:** View all loans for a specific customer.

Routing managed by React Router DOM v6 with navigation links to switch between components.

---

## Project Structure

/src
/components
LoanForm.js
LoanForm.css
PaymentForm.js
PaymentForm.css
LoanLedger.js
LoanLedger.css
CustomerOverview.js
CustomerOverview.css
App.js
App.css
/backend
db.js
db.sql (optional for schema)
index.js (Express server entry)
/routes
loans.js
customers.js
bank.db
package.json
README.md
.gitignore

text

---

## Styling

Each React component has its own CSS file imported locally:

- `LoanForm.css`
- `PaymentForm.css`
- `LoanLedger.css`
- `CustomerOverview.css`

App-wide styles and navigation styling are in `App.css`.

---

## Troubleshooting

- Ensure backend server is running before starting frontend.
- Make sure React Router version 6 is installed for routing compatibility.
- Database `bank.db` is created automatically; inspect with [DB Browser for SQLite](https://sqlitebrowser.org) or use SQLite CLI.
- Use correct REST API URLs (e.g., `http://localhost:3000/api/v1/loans/{loan_id}/payments`) while testing endpoints.
- Use browser console and backend logs for error tracking.

---

## Contributing

Feel free to fork and submit pull requests for bugs, improvements, or new features. For major changes, please open an issue first to discuss.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

If you have questions or need help running this project, please contact [your email or GitHub profile].

---

Happy Coding! 🚀
