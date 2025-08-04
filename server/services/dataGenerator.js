const seedrandom = require('seedrandom');
const { faker: baseFaker } = require('@faker-js/faker');

// Pre-load all supported locales
const locales = {
  'en-US': require('@faker-js/faker/locale/en'),
  'de-DE': require('@faker-js/faker/locale/de'),
  'fr-FR': require('@faker-js/faker/locale/fr')
};

class DataGenerator {
  constructor() {
    this.locales = Object.keys(locales);
    this.defaultLocale = 'en-US';
  }

  getFaker(locale, rng) {
    // Use the specified locale or fall back to default
    const selectedLocale = this.locales.includes(locale) ? locale : this.defaultLocale;
    
    // Import faker with the specific locale
    try {
      let faker;
      if (selectedLocale === 'de-DE') {
        faker = require('@faker-js/faker/locale/de').faker;
      } else if (selectedLocale === 'fr-FR') {
        faker = require('@faker-js/faker/locale/fr').faker;
      } else {
        faker = require('@faker-js/faker/locale/en').faker;
      }
      
      // CRITICAL: Override Faker's internal random function with our seeded RNG
      if (rng && faker) {
        // Store original random function
        const originalRandom = faker.datatype ? faker.datatype.number : null;
        
        // Override the internal random number generator
        if (faker.helpers && faker.helpers.arrayElement) {
          const originalArrayElement = faker.helpers.arrayElement;
          faker.helpers.arrayElement = function(array) {
            if (!array || array.length === 0) return undefined;
            const index = Math.floor(rng() * array.length);
            return array[index];
          };
        }
        
        // Override number generation
        if (faker.datatype) {
          faker.datatype.number = function(options = {}) {
            const min = options.min || 0;
            const max = options.max || 99999;
            return Math.floor(rng() * (max - min + 1)) + min;
          };
        }
        
        // Override the core random function if available
        if (faker.mersenne) {
          faker.mersenne.rand = rng;
        }
      }
      
      return faker;
    } catch (error) {
      console.error('Error setting up faker:', error);
      const { faker: defaultFaker } = require('@faker-js/faker');
      return defaultFaker;
    }
  }

  generateSeededRandom(seed) {
    return seedrandom(seed);
  }

  generateISBN(rng) {
    const prefix = '978';
    const group = rng().toString().slice(2, 3);
    const publisher = rng().toString().slice(2, 5);
    const title = rng().toString().slice(2, 8);
    const checkDigit = Math.floor(rng() * 10);
    return `${prefix}-${group}-${publisher}-${title}-${checkDigit}`;
  }

  generateBook(index, locale, userSeed, page = 0) {
    try {
      const seed = `${userSeed}-${page}-${index}`;
      const rng = this.generateSeededRandom(seed);
      const faker = this.getFaker(locale, rng);
      
      // Generate book data with fallbacks
      const title = this._generateTitle(faker, rng);
      const author = this._generateAuthorName(faker, rng);
      
      return {
        index: index + 1,
        isbn: this.generateISBN(rng),
        title: title,
        authors: [author],
        publisher: this._generatePublisher(faker, rng),
        publishedYear: this._generatePublishedYear(faker, rng),
        pageCount: this._generatePageCount(faker, rng),
        seed: seed
      };
    } catch (error) {
      console.error('Error generating book:', error);
      return this._getDefaultBook(index);
    }
  }
  
  _generateTitle(faker, rng) {
    try {
      const locale = faker.locale || 'en-US';
      
      // Function to generate title parts based on language patterns
      const generateTitlePattern = () => {
        const patterns = {
          'en-US': () => {
            const patterns = [
              () => `The ${faker.word.adjective()} ${faker.word.noun()}`,
              () => `${faker.word.adjective().charAt(0).toUpperCase() + faker.word.adjective().slice(1)}: A ${faker.word.adjective()} ${faker.word.noun()}`,
              () => `${faker.word.noun().charAt(0).toUpperCase() + faker.word.noun().slice(1)} of ${faker.word.noun({ length: { min: 3, max: 8 } })}`,
              () => `When ${faker.word.noun()} ${faker.word.verb()} ${faker.word.noun()}`,
              () => `The ${faker.word.adjective()} ${faker.word.noun()} of ${faker.word.noun()}`,
              () => `A ${faker.word.adjective()} ${faker.word.noun()} in ${faker.word.noun()}`
            ];
            return patterns[Math.floor(rng() * patterns.length)]();
          },
          'de-DE': () => {
            const articles = ['der', 'die', 'das'];
            const article = articles[Math.floor(rng() * articles.length)];
            const patterns = [
              () => `${article.charAt(0).toUpperCase() + article.slice(1)} ${faker.word.adjective()} ${faker.word.noun()}`,
              () => `Die ${faker.word.noun().charAt(0).toUpperCase() + faker.word.noun().slice(1)} des ${faker.word.adjective()}n ${faker.word.noun()}`,
              () => `Über ${faker.word.adjective()} ${faker.word.noun({ length: { min: 2, max: 8 } })}`,
              () => `Die ${faker.word.adjective()} ${faker.word.noun()} und ${faker.word.noun()}`
            ];
            return patterns[Math.floor(rng() * patterns.length)]();
          },
          'fr-FR': () => {
            const articles = ['le', 'la', 'les'];
            const article = articles[Math.floor(rng() * articles.length)];
            const patterns = [
              () => `${article.charAt(0).toUpperCase() + article.slice(1)} ${faker.word.noun()} ${faker.word.adjective()}`,
              () => `La ${faker.word.noun()} ${faker.word.adjective()}`,
              () => `Les ${faker.word.noun()} ${faker.word.adjective()}`,
              () => `L'${faker.word.noun().charAt(0).toLowerCase() + faker.word.noun().slice(1)} ${faker.word.adjective()}`,
              () => `${faker.word.noun().charAt(0).toUpperCase() + faker.word.noun().slice(1)} et ${faker.word.noun()}`
            ];
            return patterns[Math.floor(rng() * patterns.length)]();
          }
        };
        
        const generator = patterns[locale] || patterns['en-US'];
        return generator();
      };
      
      let title = generateTitlePattern();
      
      // Add variations like subtitles 30% of the time
      if (rng() > 0.7) {
        const subtitleConnectors = {
          'en-US': [': ', ' - ', ': A '],
          'de-DE': [': ', ' - ', ': '],
          'fr-FR': [' : ', ' - ', '. ']
        };
        
        const connector = (subtitleConnectors[locale] || subtitleConnectors['en-US'])[
          Math.floor(rng() * 3)
        ];
        
        const subtitle = generateTitlePattern().toLowerCase();
        title += connector + subtitle;
      }
      
      // Apply title case for all languages
      title = title.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        
      // Fix any grammar issues with articles
      title = title.replace(/\s+(a|an|the|der|die|das|le|la|les|un|une|des)\s+/gi, 
        (match, article) => ` ${article.toLowerCase()} `);
        
      return title;
    } catch (e) {
      console.error('Error generating title:', e);
      return faker.lorem.words(3).split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  }
  
  _generateAuthorName(faker, rng) {
    try {
      const locale = faker.locale || 'en-US';
      
      // Generate names based on locale-specific patterns
      const nameGenerators = {
        'en-US': () => {
          // English: FirstName LastName
          return `${faker.person.firstName()} ${faker.person.lastName()}`;
        },
        'de-DE': () => {
          // German: FirstName MiddleName LastName (sometimes with von/zu)
          const hasMiddleName = rng() > 0.5;
          const hasNobility = rng() > 0.8;
          
          let name = faker.person.firstName();
          if (hasMiddleName) {
            name += ` ${faker.person.middleName()}`;
          }
          
          if (hasNobility) {
            const nobility = ['von', 'zu', 'von der', 'von und zu'][Math.floor(rng() * 4)];
            return `${name} ${nobility} ${faker.person.lastName()}`;
          }
          
          return `${name} ${faker.person.lastName()}`;
        },
        'fr-FR': () => {
          // French: FirstName (sometimes with hyphen) LastName (sometimes with de/du/la)
          const hasHyphen = rng() > 0.7;
          const hasParticle = rng() > 0.7;
          
          let firstName = faker.person.firstName();
          if (hasHyphen) {
            firstName += `-${faker.person.firstName()}`;
          }
          
          let lastName = faker.person.lastName();
          if (hasParticle) {
            const particle = ['de', 'du', 'de la', 'le'][Math.floor(rng() * 4)];
            lastName = `${particle} ${lastName}`;
          }
          
          return `${firstName} ${lastName}`;
        }
      };
      
      const generator = nameGenerators[locale] || nameGenerators['en-US'];
      return generator();
    } catch (e) {
      console.error('Error generating author name:', e);
      return 'Anonymous Author';
    }
  }
  
  _generatePublisher(faker, rng) {
    try {
      const locale = faker.locale || 'en-US';
      const suffixes = {
        'en-US': ['Publishing', 'Books', 'Press', 'Media', 'House'],
        'de-DE': ['Verlag', 'Bücher', 'Verlagsgruppe', 'Media', 'Verlagsanstalt'],
        'fr-FR': ['Éditions', 'Livres', 'Presse', 'Médias', 'Maison d\'édition']
      };
      
      const suffixList = suffixes[locale] || suffixes['en-US'];
      const suffix = suffixList[Math.floor(rng() * suffixList.length)];
      
      const name = faker.company?.name?.() || 'Publishing';
      return `${name} ${suffix}`.trim();
    } catch (e) {
      return locale === 'de-DE' ? 'Weltverlag' : 
             locale === 'fr-FR' ? 'Éditions Mondiales' : 
             'Global Publishing';
    }
  }
  
  _generatePublishedYear(faker, rng) {
    try {
      const year = Math.floor(rng() * 10) + new Date().getFullYear() - 10;
      return year;
    } catch (e) {
      return new Date().getFullYear();
    }
  }
  
  _generatePageCount(faker, rng) {
    try {
      return Math.floor(rng() * 700) + 100;
    } catch (e) {
      return 300;
    }
  }
  
  _getDefaultBook(index) {
    return {
      index: index + 1,
      isbn: '978-0-000-00000-0',
      title: 'A Wonderful Book',
      authors: ['Anonymous Author'],
      publisher: 'Global Publishing',
      publishedYear: new Date().getFullYear(),
      pageCount: 300,
      seed: 'default'
    };
  }
  
  _capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }

  generateLikes(bookSeed, averageLikes) {
    const rng = this.generateSeededRandom(`${bookSeed}-likes`);
    const wholePart = Math.floor(averageLikes);
    const fractionalPart = averageLikes - wholePart;
    
    let likes = wholePart;
    if (rng() < fractionalPart) {
      likes += 1;
    }
    
    return likes;
  }

  generateReviews(bookSeed, averageReviews, locale) {
    try {
      const reviewRng = this.generateSeededRandom(`${bookSeed}-reviews`);
      const reviewCount = Math.min(Math.max(1, Math.floor(reviewRng() * 10)), 10); // 1-10 reviews
      const reviews = [];
      const faker = this.getFaker(locale);
      
      // Define review templates based on locale
      const reviewTemplates = {
        'en-US': {
          positive: [
            'Absolutely loved this book! The story was captivating from start to finish.',
            'Highly recommended. One of the best books I\'ve read this year!',
            'Couldn\'t put it down. The characters were so well-developed and relatable.'
          ],
          neutral: [
            'A good read overall, though it had some slow parts.',
            'Enjoyed the book, but I expected a bit more from the ending.',
            'Well-written, but the plot was somewhat predictable.'
          ],
          negative: [
            'Not what I expected. The story felt rushed and underdeveloped.',
            'Had high hopes but was ultimately disappointed with the execution.',
            'Struggled to finish this one. The characters lacked depth.'
          ]
        },
        'de-DE': {
          positive: [
            'Absolut gelungen! Das Buch hat mich von der ersten bis zur letzten Seite gefesselt.',
            'Sehr empfehlenswert. Eines der besten Bücher, die ich dieses Jahr gelesen habe!',
            'Konnte es nicht aus der Hand legen. Die Charaktere waren so gut ausgearbeitet.'
          ],
          neutral: [
            'Insgesamt ein gutes Buch, auch wenn es einige langsame Stellen gab.',
            'Hat mir gefallen, aber ich hatte mir vom Ende etwas mehr erhofft.',
            'Gut geschrieben, aber die Handlung war etwas vorhersehbar.'
          ],
          negative: [
            'Nicht das, was ich erwartet hatte. Die Geschichte wirkte überstürzt und unausgegoren.',
            'Hatte hohe Erwartungen, war aber letztendlich enttäuscht von der Umsetzung.',
            'Habe mich durch das Buch gequält. Die Charaktere wirkten oberflächlich.'
          ]
        },
        'fr-FR': {
          positive: [
            'J\'ai adoré ce livre ! L\'histoire était captivante du début à la fin.',
            'Vivement recommandé. L\'un des meilleurs livres que j\'ai lus cette année !',
            'Je n\'ai pas pu le lâcher. Les personnages étaient si bien développés et attachants.'
          ],
          neutral: [
            'Une bonne lecture dans l\'ensemble, même s\'il y avait quelques longueurs.',
            'J\'ai apprécié le livre, mais je m\'attendais à un peu plus de la fin.',
            'Bien écrit, mais l\'intrigue était quelque peu prévisible.'
          ],
          negative: [
            'Ce n\'était pas ce à quoi je m\'attendais. L\'histoire m\'a parue précipitée et peu développée.',
            'J\'avais de grands espoirs, mais j\'ai été finalement déçu par le résultat.',
            'J\'ai eu du mal à le terminer. Les personnages manquaient de profondeur.'
          ]
        }
      };
      
      // Get the appropriate templates for the current locale, default to English
      const templates = reviewTemplates[locale] || reviewTemplates[this.defaultLocale];
      
      for (let i = 0; i < reviewCount; i++) {
        try {
          const reviewRng = this.generateSeededRandom(`${bookSeed}-review-${i}`);
          const firstName = faker.person?.firstName?.() || 'User';
          const lastName = faker.person?.lastName?.() || (i + 1).toString();
          
          // Determine review sentiment based on rating
          const rating = Math.min(5, Math.max(1, Math.floor(reviewRng() * 5) + 1));
          let reviewText;
          
          if (rating >= 4) {
            reviewText = templates.positive[Math.floor(reviewRng() * templates.positive.length)];
          } else if (rating >= 2) {
            reviewText = templates.neutral[Math.floor(reviewRng() * templates.neutral.length)];
          } else {
            reviewText = templates.negative[Math.floor(reviewRng() * templates.negative.length)];
          }
          
          reviews.push({
            author: `${firstName} ${lastName}`.trim(),
            text: reviewText,
            rating: rating
          });
        } catch (error) {
          console.error(`Error generating review ${i}:`, error);
          continue;
        }
      }
      
      return reviews;
    } catch (error) {
      console.error('Error in generateReviews:', error);
      const defaultReview = {
        'en-US': { author: 'Book Lover', text: 'This is a great book!', rating: 5 },
        'de-DE': { author: 'Buchliebhaber', text: 'Das ist ein tolles Buch!', rating: 5 },
        'fr-FR': { author: 'Amateur de livres', text: 'C\'est un excellent livre !', rating: 5 }
      };
      
      return [defaultReview[locale] || defaultReview[this.defaultLocale]];
    }
  }

  generateBookCover(title, authors, seed) {
    const rng = this.generateSeededRandom(`${seed}-cover`);
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#FF7F50', '#87CEEB', '#F0E68C', '#FFB6C1'
    ];
    
    const colorIndex = Math.floor(rng() * colors.length);
    const backgroundColor = colors[colorIndex];
    
    return {
      backgroundColor,
      title,
      authors: authors.join(', '),
      pattern: Math.floor(rng() * 5) // Different patterns for variety
    };
  }

  generateBooks(page, pageSize, locale, userSeed, averageLikes, averageReviews) {
    const books = [];
    const startIndex = page * pageSize;

    for (let i = 0; i < pageSize; i++) {
      const bookIndex = startIndex + i;
      const book = this.generateBook(bookIndex, locale, userSeed, page);
      
      book.likes = this.generateLikes(book.seed, averageLikes);
      book.reviews = this.generateReviews(book.seed, averageReviews, locale);
      book.cover = this.generateBookCover(book.title, book.authors, book.seed);
      
      books.push(book);
    }

    return books;
  }
}

const { getConnection } = require('../config/database');

/**
 * Bulk insert generated books into the database.
 * @param {number} page
 * @param {number} pageSize
 * @param {string} locale
 * @param {string} userSeed
 * @param {number} averageLikes
 * @param {number} averageReviews
 */
DataGenerator.prototype.insertBooksToDB = async function(page, pageSize, locale, userSeed, averageLikes, averageReviews) {
  const connection = connectDB();
  const books = this.generateBooks(page, pageSize, locale, userSeed, averageLikes, averageReviews);

  // Ensure books table exists
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS books (
      id INT AUTO_INCREMENT PRIMARY KEY,
      isbn VARCHAR(32) NOT NULL,
      title VARCHAR(255) NOT NULL,
      authors TEXT NOT NULL,
      publisher VARCHAR(255) NOT NULL,
      likes INT DEFAULT 0,
      reviews JSON,
      cover JSON
    )
  `);

  // Bulk insert books
  const insertQuery = `INSERT INTO books (isbn, title, authors, publisher, likes, reviews, cover)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  for (const book of books) {
    await connection.execute(insertQuery, [
      book.isbn,
      book.title,
      JSON.stringify(book.authors),
      book.publisher,
      book.likes || 0,
      JSON.stringify(book.reviews || []),
      JSON.stringify(book.cover || {})
    ]);
  }
};

module.exports = new DataGenerator();