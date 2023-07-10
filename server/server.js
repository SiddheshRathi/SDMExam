const express = require('express');
const mysql = require('mysql');

const app = express();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database_name'
});

app.use(express.json());

app.get('/books/:author', (req, res) => {
  const author = req.params.author;

  pool.getConnection((err, connection) => {
    if (err) {
      res.status(500).json({ error: 'Error connecting to the database' });
      return;
    }

    const query = 'SELECT * FROM Book_Tb WHERE author = ?';

    connection.query(query, [author], (err, results) => {
      connection.release();

      if (err) {
        res.status(500).json({ error: 'Error executing the query' });
        return;
      }

      res.json(results);
    });
  });
});

app.post('/books', (req, res) => {
  const { b_name, author, book_type, price, publishedDate, language } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      res.status(500).json({ error: 'Error connecting to the database' });
      return;
    }

    const query = 'INSERT INTO Book_Tb (b_name, author, book_type, price, publishedDate, language) VALUES (?, ?, ?, ?, ?, ?)';

    connection.query(query, [b_name, author, book_type, price, publishedDate, language], (err, result) => {
      connection.release();

      if (err) {
        res.status(500).json({ error: 'Error executing the query' });
        return;
      }

      res.json({ message: 'Book added successfully', bookId: result.insertId });
    });
  });
});

app.put('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const { price, language } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      res.status(500).json({ error: 'Error connecting to the database' });
      return;
    }

    const query = 'UPDATE Book_Tb SET price = ?, language = ? WHERE id = ?';

    connection.query(query, [price, language, bookId], (err, result) => {
      connection.release();

      if (err) {
        res.status(500).json({ error: 'Error executing the query' });
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Book not found' });
      } else {
        res.json({ message: 'Book updated successfully' });
      }
    });
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
