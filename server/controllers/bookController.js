const dataGenerator = require('../services/dataGenerator');
const csvWriter = require('csv-writer');
const path = require('path');
const fs = require('fs');

class BookController {
  async getBooks(req, res) {
    try {
      const {
        page = 0,
        pageSize = 20,
        locale = 'en-US',
        seed = '42',
        averageLikes = 0,
        averageReviews = 0
      } = req.query;

      console.log(`Generating books - Page: ${page}, PageSize: ${pageSize}, Locale: ${locale}, Seed: ${seed}`);
      
      const startTime = Date.now();
      const books = dataGenerator.generateBooks(
        parseInt(page),
        parseInt(pageSize),
        locale,
        seed,
        parseFloat(averageLikes) || 0,
        parseFloat(averageReviews) || 0
      );
      
      const endTime = Date.now();
      console.log(`Generated ${books.length} books in ${endTime - startTime}ms`);

      // Log first book for debugging
      if (books.length > 0) {
        console.log('Sample book:', {
          title: books[0].title,
          author: books[0].authors?.[0] || 'Unknown',
          publisher: books[0].publisher
        });
      }

      res.json({
        success: true,
        data: books,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalDisplayed: (parseInt(page) + 1) * parseInt(pageSize)
      });
    } catch (error) {
      console.error('Error in getBooks:', {
        message: error.message,
        stack: error.stack,
        query: req.query
      });
      res.status(500).json({
        success: false,
        message: 'Failed to generate books',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  async getBookDetails(req, res) {
    try {
      const { bookId } = req.params;
      const {
        locale = 'en-US',
        seed = '42',
        averageLikes = 0,
        averageReviews = 0,
        page = 0
      } = req.query;

      // Extract index from bookId (format: page-index)
      const [bookPage, bookIndex] = bookId.split('-').map(num => parseInt(num));
      const actualIndex = bookPage * 20 + bookIndex;

      const book = dataGenerator.generateBook(actualIndex, locale, seed, bookPage, parseFloat(averageLikes), parseFloat(averageReviews));
      book.likes = dataGenerator.generateLikes(book.seed, parseFloat(averageLikes));
      book.reviews = dataGenerator.generateReviews(book.seed, parseFloat(averageReviews), locale);
      book.cover = dataGenerator.generateBookCover(book.title, book.authors, book.seed);

      res.json({
        success: true,
        data: book
      });
    } catch (error) {
      console.error('Error getting book details:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting book details',
        error: error.message
      });
    }
  }

  async exportCSV(req, res) {
    try {
      const {
        pages = 1,
        locale = 'en-US',
        seed = '42',
        averageLikes = 0,
        averageReviews = 0
      } = req.query;

      const allBooks = [];
      const totalPages = parseInt(pages);

      // Generate all books for the specified pages
      for (let page = 0; page < totalPages; page++) {
        const books = dataGenerator.generateBooks(
          page,
          20, // Standard page size
          locale,
          seed,
          parseFloat(averageLikes),
          parseFloat(averageReviews)
        );
        allBooks.push(...books);
      }

      const fileName = `books_export_${Date.now()}.csv`;
      const filePath = path.join(__dirname, '..', 'temp', fileName);

      const tempDir = path.join(__dirname, '..', 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const writer = csvWriter.createObjectCsvWriter({
        path: filePath,
        header: [
          { id: 'index', title: 'Index' },
          { id: 'isbn', title: 'ISBN' },
          { id: 'title', title: 'Title' },
          { id: 'authors', title: 'Authors' },
          { id: 'publisher', title: 'Publisher' },
          { id: 'likes', title: 'Likes' },
          { id: 'reviewCount', title: 'Reviews Count' }
        ]
      });

      const csvData = allBooks.map(book => ({
        index: book.index,
        isbn: book.isbn,
        title: book.title,
        authors: book.authors.join('; '),
        publisher: book.publisher,
        likes: book.likes,
        reviewCount: book.reviews.length
      }));

      await writer.writeRecords(csvData);

      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
        }
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting temp file:', unlinkErr);
          }
        });
      });

    } catch (error) {
      console.error('Error exporting CSV:', error);
      res.status(500).json({
        success: false,
        message: 'Error exporting CSV',
        error: error.message
      });
    }
  }

  async generateRandomSeed(req, res) {
    try {
      const randomSeed = Math.floor(Math.random() * 1000000).toString();
      res.json({
        success: true,
        seed: randomSeed
      });
    } catch (error) {
      console.error('Error generating random seed:', error);
      res.status(500).json({
        success: false,
        message: 'Error generating random seed',
        error: error.message
      });
    }
  }
}

module.exports = new BookController();