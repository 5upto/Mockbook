const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Get books with pagination and filtering
router.get('/', bookController.getBooks);

// Get specific book details
router.get('/:bookId', bookController.getBookDetails);

// Export books to CSV
router.get('/export/csv', bookController.exportCSV);

// Generate random seed
router.post('/random-seed', bookController.generateRandomSeed);

module.exports = router;