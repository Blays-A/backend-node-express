const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let users = [];
// Данные книг
const books = [
    // Психология
    { isbn: '978-3-16-148410-0', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'Psychology', reviews: [] },
    { isbn: '978-1-4028-9462-6', title: 'The Power of Habit', author: 'Charles Duhigg', genre: 'Psychology', reviews: [] },
    { isbn: '978-0-06-231609-7', title: 'Quiet: The Power of Introverts', author: 'Susan Cain', genre: 'Psychology', reviews: [] },
    { isbn: '978-0-14-312774-1', title: 'Outliers: The Story of Success', author: 'Malcolm Gladwell', genre: 'Psychology', reviews: [] },
    { isbn: '978-0-307-28245-3', title: 'The Psychopath Test', author: 'Jon Ronson', genre: 'Psychology', reviews: [] },
    { isbn: '978-0-06-241586-5', title: 'Influence: The Psychology of Persuasion', author: 'Robert Cialdini', genre: 'Psychology', reviews: [] },
    { isbn: '978-0-14-312774-1', title: 'Blink: The Power of Thinking Without Thinking', author: 'Malcolm Gladwell', genre: 'Psychology', reviews: [] },
    { isbn: '978-0-06-245771-4', title: 'Grit: The Power of Passion and Perseverance', author: 'Angela Duckworth', genre: 'Psychology', reviews: [] },
    { isbn: '978-0-06-232624-8', title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', genre: 'Psychology', reviews: [] },
    { isbn: '978-0-547-37337-0', title: 'Emotional Intelligence', author: 'Daniel Goleman', genre: 'Psychology', reviews: [] },

    // Финансы
    { isbn: '978-0-13-272576-3', title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', genre: 'Finance', reviews: [] },
    { isbn: '978-0-307-95156-7', title: 'The Millionaire Next Door', author: 'Thomas Stanley', genre: 'Finance', reviews: [] },
    { isbn: '978-0-14-312759-8', title: 'The Intelligent Investor', author: 'Benjamin Graham', genre: 'Finance', reviews: [] },
    { isbn: '978-0-99-349530-6', title: 'Financial Freedom', author: 'Grant Sabatier', genre: 'Finance', reviews: [] },
    { isbn: '978-0-07-182005-6', title: 'Your Money or Your Life', author: 'Joe Dominguez', genre: 'Finance', reviews: [] },
    { isbn: '978-1-9848-0815-3', title: 'Principles: Life and Work', author: 'Ray Dalio', genre: 'Finance', reviews: [] },
    { isbn: '978-1-5011-0347-5', title: 'The Total Money Makeover', author: 'Dave Ramsey', genre: 'Finance', reviews: [] },
    { isbn: '978-1-63421-198-4', title: 'The Barefoot Investor', author: 'Scott Pape', genre: 'Finance', reviews: [] },
    { isbn: '978-0-385-52930-0', title: 'The Simple Path to Wealth', author: 'JL Collins', genre: 'Finance', reviews: [] },
    { isbn: '978-1-78793-604-0', title: 'Financial Freedom', author: 'Jessica Moorhouse', genre: 'Finance', reviews: [] },

    // Коммуникация
    { isbn: '978-0-380-70979-9', title: 'How to Win Friends and Influence People', author: 'Dale Carnegie', genre: 'Communication', reviews: [] },
    { isbn: '978-0-8129-9154-4', title: 'Crucial Conversations', author: 'Kerry Patterson', genre: 'Communication', reviews: [] },
    { isbn: '978-0-06-227318-2', title: 'The 7 Habits of Highly Effective People', author: 'Stephen Covey', genre: 'Communication', reviews: [] },
    { isbn: '978-0-14-312611-2', title: 'Dare to Lead', author: 'Brené Brown', genre: 'Communication', reviews: [] },
    { isbn: '978-1-4213-8226-2', title: 'The Art of Communicating', author: 'Thich Nhat Hanh', genre: 'Communication', reviews: [] },
    { isbn: '978-0-125-01415-7', title: 'The Art of Listening', author: 'Erich Fromm', genre: 'Communication', reviews: [] },
    { isbn: '978-0-06-289358-3', title: 'Nonviolent Communication', author: 'Marshall Rosenberg', genre: 'Communication', reviews: [] }
];

app.post('/user/:username/book/:isbn/review/add', (req, res) => {
    const { username, isbn } = req.params;
    const { review } = req.body;

    // Находим книгу по ISBN
    const book = books.find(book => book.isbn === isbn);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Проверяем, есть ли уже отзыв этого пользователя
    const existingReview = book.reviews.find(review => review.username === username);
    if (existingReview) {
        return res.status(400).json({ message: 'User has already reviewed this book' });
    }

    // Добавляем новый отзыв
    book.reviews.push({ username, review });

    // Возвращаем сообщение об успехе
    res.status(201).json({ message: `Review added for book ${book.title} by user ${username}`, review });
});


app.get('/user/:username/reviews', (req, res) => {
    const { username } = req.params;

    // Собираем все отзывы пользователя
    const userReviews = [];

    // Ищем все отзывы по всем книгам
    books.forEach(book => {
        book.reviews.forEach(review => {
            if (review.username === username) {
                userReviews.push({
                    isbn: book.isbn,
                    title: book.title,
                    review: review.review
                });
            }
        });
    });

    // Проверяем, если отзывы найдены
    if (userReviews.length > 0) {
        return res.json(userReviews);
    } else {
        return res.status(404).json({ message: `No reviews found for user ${username}` });
    }
});


// Маршрут для получения списка книг
app.get('/', (req, res) => {
    console.log('GET request to the root endpoint');
    res.send('Server is working!');
});

// Маршрут для получения списка книг
app.get('/books', (req, res) => {
    console.log('GET request to /books');
    res.json(books);
});

app.get('/books/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;  // Извлекаем ISBN из URL
    const book = books.find(b => b.isbn === isbn);  // Ищем книгу по ISBN

    if (book) {
        res.json(book);  // Если книга найдена, возвращаем её
    } else {
        res.status(404).json({ message: 'Book not found' });  // Если книга не найдена, возвращаем ошибку 404
    }
});

app.get('/books/author/:author', (req, res) => {
    const author = req.params.author;
    const authorBooks = books.filter(book => book.author.toLowerCase() === author.toLowerCase());

    if (authorBooks.length > 0) {
        res.json(authorBooks);
    } else {
        res.status(404).json({ message: 'No books found for this author' });
    }
});

app.get('/books/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(title));
    if (filteredBooks.length > 0) {
        res.json(filteredBooks);
    } else {
        res.status(404).send('No books found with that title');
    }
});

app.get('/book/review/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const book = books.find(b => b.title.toLowerCase() === title);

    if (book) {
        res.json({ review: book.review });
    } else {
        res.status(404).send('Book not found');
    }
});

app.get('/register', (req, res) => {
    const { username, password } = req.query;  // Извлекаем параметры из query

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    // Проверка, существует ли уже такой пользователь
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).send('Username already taken');
    }

    // Добавляем нового пользователя в массив
    const newUser = { username, password };
    users.push(newUser);

    res.status(200).send('User registered successfully');
});


app.get('/login', (req, res) => {
    const { username, password } = req.query;  // Извлекаем данные из query параметров

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    // Поиск пользователя по логину и паролю
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).send('Invalid username or password');
    }

    res.status(200).send(`Welcome back, ${username}!`);
});

app.put('/user/:username/review/:isbn/:review', (req, res) => {
    const { username, isbn, review } = req.params;

    console.log(`Received request: username = ${username}, isbn = ${isbn}, review = ${review}`);

    if (!username || !isbn || !review) {
        return res.status(400).send('Username, ISBN, and review are required');
    }

    // Ищем книгу по ISBN
    const book = books.find(b => b.isbn === isbn);

    console.log(`Book found: ${JSON.stringify(book)}`);

    if (!book) {
        return res.status(404).send('Book not found');
    }

    // Ищем существующий отзыв пользователя
    const existingReview = book.reviews.find(r => r.username === username);

    if (existingReview) {
        // Если отзыв найден, обновляем его
        existingReview.review = review;
        return res.status(200).send('Review updated successfully!');
    } else {
        // Если отзыв не найден, добавляем новый
        book.reviews.push({ username, review });
        return res.status(201).send('Review added successfully!');
    }
});

app.delete('/user/:username/book/:isbn/review/delete', (req, res) => {
    const { username, isbn } = req.params;

    // Find the book
    const book = books.find(book => book.isbn === isbn);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Find the review by username
    const reviewIndex = book.reviews.findIndex(review => review.username === username);
    if (reviewIndex === -1) {
        return res.status(404).json({ message: 'Review not found for this user' });
    }

    // Remove the review
    book.reviews.splice(reviewIndex, 1);

    // Return success message
    res.json({ message: `Review deleted by user ${username} for book ${book.title}` });
});

app.get('/books/async', async (req, res) => {
    try {
        const getBooks = (callback) => {
            setTimeout(() => {
                callback(null, books); // имитируем асинхронную операцию
            }, 1000);
        };

        getBooks((error, booksData) => {
            if (error) {
                return res.status(500).json({ message: 'Error fetching books' });
            }
            res.json(booksData);
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const findBookByIsbn = (isbn) => {
    return new Promise((resolve, reject) => {
        const book = books.find(book => book.isbn === isbn);
        if (book) {
            resolve(book);
        } else {
            reject('Book not found');
        }
    });
};

// Роут для поиска книги по ISBN
app.get('/books/search', async (req, res) => {
    const { isbn } = req.query; // Получаем ISBN из query-параметров запроса

    try {
        if (!isbn) {
            return res.status(400).json({ message: 'ISBN is required' });
        }

        const book = await findBookByIsbn(isbn); // Ищем книгу с использованием промиса
        res.json(book); // Возвращаем найденную книгу
    } catch (error) {
        res.status(404).json({ message: error }); // Если книга не найдена
    }
});

const findBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        const booksByAuthor = books.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
        if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
        } else {
            reject('No books found by this author');
        }
    });
};

app.get('/books/search/author', async (req, res) => {
    const { author } = req.query; // Получаем автор из query-параметров запроса

    try {
        if (!author) {
            return res.status(400).json({ message: 'Author is required' });
        }

        const booksByAuthor = await findBooksByAuthor(author); // Ищем книги по автору
        res.json(booksByAuthor); // Возвращаем найденные книги
    } catch (error) {
        res.status(404).json({ message: error }); // Если книги не найдены
    }
});

const findBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
        const booksByTitle = books.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
        if (booksByTitle.length > 0) {
            resolve(booksByTitle);
        } else {
            reject('No books found with this title');
        }
    });
};

app.get('/books/search/title', async (req, res) => {
    const { title } = req.query; // Получаем название из query-параметров запроса

    try {
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const booksByTitle = await findBooksByTitle(title); // Ищем книги по названию
        res.json(booksByTitle); // Возвращаем найденные книги
    } catch (error) {
        res.status(404).json({ message: error }); // Если книги не найдены
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});