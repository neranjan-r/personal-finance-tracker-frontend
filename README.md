# Personal Finance Tracker - Frontend

Modern, responsive frontend application for the Personal Finance Tracker, built with React, Vite, Tailwind CSS, and Recharts.

## Features

- **Authentication**: JWT-based authentication with automatic redirect and persistent session.
- **Dashboard Overview**: Summary metric cards for total income, expenses, net savings, and balance.
- **Interactive Visualizations**: Expense breakdown by category (Pie chart) and monthly trends (Bar chart) powered by Recharts.
- **Transaction Management**: Add, edit, delete, and view transactions with real-time status and category tags.
- **Advanced Filtering**: Filter by transaction type (Income/Expense), category, and date range with URL state synchronization.
- **Budget Tracking**: Budget threshold alerts and visual progress bars warning when spending approaches limits.
- **Export Data**: Export transaction history to CSV and JSON formats.
- **Profile & Settings**: User preferences management including default currency selection.

## Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Data Visualization**: Recharts
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and set your backend API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Run tests:
   ```bash
   npm test
   ```

6. Run linter:
   ```bash
   npm run lint
   ```
