# Mockbook

A full-stack book store application built with React, Vite, and Node.js with Express. The application generates and displays realistic fake book data for testing and demonstration purposes.

## Features

-  Browse books with infinite scroll
-  Search functionality to find specific books
-  Responsive design that works on all devices
-  Modern UI built with Tailwind CSS
-  Real-time data generation and filtering

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Axios for API calls
- React Infinite Scroll Component
- Font Awesome Icons

### Backend
- Node.js with Express
- MySQL database
- Faker.js for generating realistic book data
- CORS enabled for secure cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MySQL Server

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/5upto/Mockbook
   cd Mockbook
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the `server` directory with your database credentials:
     ```
     DB_HOST=your_database_host
     DB_USER=your_database_user
     DB_PASSWORD=your_database_password
     DB_NAME=your_database_name
     PORT=5000
     ```

### Running the Application

1. Start the backend server:
   ```bash
   cd server
   node server.js
   ```

2. In a new terminal, start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
book-store/
├── client/                 
│   ├── public/             
│   ├── src/
│   │   ├── assets/         
│   │   ├── components/    
│   │   ├── contexts/       
│   │   └── services/       
│   └── ...
│
└── server/                 
    ├── config/            
    ├── controllers/       
    ├── routes/           
    ├── services/        
    └── server.js        
```

## Available Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Server
- `nodemon server.js` - Start production server
- `node server.js` - Start development server with nodemon

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
