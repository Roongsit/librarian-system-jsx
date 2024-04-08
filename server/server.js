import express from 'express'
import cors from 'cors'
import Jwt  from 'jsonwebtoken'
import fs from 'fs'
const secret = 'sudlorprokyung';
import multer from 'multer'

import dotenv from 'dotenv' 
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json())

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      return cb(null, "../server/img")
    },
    filename: function (req, file, cb) {
      return cb(null, `${file.originalname}`)
    }
  })

  const upload = multer({storage})

import {query} from './database.js'

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).send('Username and password are required');
  }

  try {
      const q = 'INSERT INTO authentication (username, password) VALUES (?, ?)';
      const values = [username, password];

      const results = await query(q, values);
      res.status(201).json(results);
  } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      const sql = 'SELECT * FROM authentication WHERE username = ? AND password = ?';
      const values = [username, password];
      const results = await query(sql, values); // Use await to handle the promise

      if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid username or password' });
      }

      const token = Jwt.sign({ username: username }, secret, { expiresIn: '1h' });
      console.log("success");
      res.json({ message: 'Login successful', token: token });
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.post('/decodeToken', (req, res) => {
    const { token } = req.body;
    
    if (!token) {
        return res.status(400).json({ error: 'Token not provided' });
    }

    Jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.json({ message: 'decoded success', decoded: decoded });
    });
});

app.delete('/delete_book/:bookID', async (req, res) => {
  const { bookID } = req.params;

  try {
      const q = 'DELETE FROM book WHERE bookID = ?';
      const results = await query(q, [bookID]);

      if (results.affectedRows > 0) {
          res.status(200).json({ message: 'Book deleted successfully' });
      } else {
          res.status(404).json({ message: 'Book not found' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

app.get('/get_book', async (req, res) => {
    try {
        const q = 'SELECT * FROM book ORDER BY bookName';

        await query(q, (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/post_book', upload.single('file'), async (req, res) => {
    const { id, name, category, amount } = req.body;
    const file = req.file;
    
    if (!file) {
        return res.status(400).send('No file uploaded');
        console.log(file)
    }
  
    try {
        const imageAsBase64 = await fs.readFile(file.path, 'base64');
        const q = 'INSERT INTO book (bookID, bookName, bookCategory, bookCount, bookImg, borrowing) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [id, name, category, amount, imageAsBase64, 0];
  
        const results = await query(q, values);
        res.status(201).json({ message: "Book added successfully", bookID: id });
    } catch (error) {
        console.log(error)
        console.error('Error during add book:', error);
        res.status(500).send('Internal Server Error');
    }
  });
  

// app.post('/post_book', async (req, res) => {
//     const { id, name, category, amount, file } = req.body; // Change img to file
    
//     try {
//       const q = 'INSERT INTO book (bookID, bookName, bookCategory, bookCount, bookImg, borrowing) VALUES (?, ?, ?, ?, ?, ?)';
//       const values = [id, name, category, amount, file, 0];

//       const results = await query(q, values);
//       res.status(201).json({ message: "Book added successfully", bookID: id });
//     } catch (error) {
//       console.error('Error during add book:', error);
//       res.status(500).send('Internal Server Error');
//     }
// });

app.get('/get_category', async (req, res) => {
  const q = 'SELECT * FROM category';

  try {
      const results = await query(q);
      res.json(results);
  } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.post('/post_category', async (req, res) => {
  const { categoryName } = req.body;

  if (!categoryName || categoryName.length < 3) {
      return res.status(400).send('Category name is required and must be at least 3 characters long.');
  }

  const q = 'INSERT INTO category (categoryName) VALUES (?)';
  const values = [categoryName.trim()]; 

  try {
      const results = await query(q, values);

      console.log('Insertion results:', results);
      res.status(201).json({ 
          message: "Category added successfully", 
          categoryId: results.insertId 
      });
  } catch (error) {
      console.error('Error during category insertion:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.delete('/delete_category/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const q = 'DELETE FROM category WHERE categoryID = ?';
      const results = await query(q, [parseInt(id)]);

      if (results.affectedRows === 0) {
          return res.status(404).send('Category not found');
      }

      res.status(204).send(); 
  } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.get('/get_member', async (req, res) => {
  try {
      const q = 'SELECT * FROM members ORDER BY membersID';
      const results = await query(q);
      res.json(results);
  } catch (error) {
      console.error('Error fetching members:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.post('/post_member', async (req, res) => {
  const { membersID, membersName, membersSurname, membersEmail, membersPhone_number } = req.body;

  try {
      const q = 'INSERT INTO members (membersID, membersName, membersSurname, membersEmail, membersPhone_number) VALUES (?, ?, ?, ?, ?)';
      const values = [membersID, membersName, membersSurname, membersEmail, membersPhone_number];

      const results = await query(q, values);
      res.status(201).json({ message: "Member added successfully", memberID: membersID });
  } catch (error) {
      console.error('Error during member insertion:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.delete('/delete_members/:id', async (req, res) => {
  const memberId = req.params.id;

  try {
      const q = 'DELETE FROM members WHERE membersID = ?';
      const values = [memberId];
      const results = await query(q, values);

      if (results.affectedRows === 0) {
          console.log('Member not found');
          return res.status(404).json({ message: 'Member not found' });
      }

      res.status(200).json({ message: 'Member deleted successfully' });
  } catch (error) {
      console.error('Error deleting member:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.put('/edit_member/:memberID', async (req, res) => {
  const { memberID } = req.params;
  const { memberName, memberSurname, memberEmail, memberPhone_number } = req.body;
  
  const q = 'UPDATE members SET membersName = ?, membersSurname = ?, membersEmail = ?, membersPhone_number = ? WHERE membersID = ?';

  try {
      const results = await query(q, [memberName, memberSurname, memberEmail, memberPhone_number, memberID]);
    
      if (results.affectedRows === 0) {
          res.status(404).json({ message: 'Member not found or no new data to update' });
      } else {
          res.status(200).json({ message: 'Member updated successfully' });
      }
  } catch (error) {
      console.error('Error updating member:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/get_member/:memberID', async (req, res) => {
  const { memberID } = req.params;
  const q = 'SELECT * FROM members WHERE membersID = ?';

  try {
      const results = await query(q, [memberID]);
    
      if (results.length > 0) {
          res.json(results[0]); 
      } else {
          res.status(404).send('Member not found');
      }
  } catch (error) {
      console.error('Error fetching member:', error);
      res.status(500).send('Internal Server Error');
  }
});

    
app.get('/get_book/:bookID', async (req, res) => {
  const { bookID } = req.params;
  const q = 'SELECT * FROM book WHERE bookID = ?';

  try {
      const results = await query(q, [bookID]);
    
      if (results.length > 0) {
          res.json(results[0]); 
      } else {
          res.status(404).send('Book not found');
      }
  } catch (error) {
      console.error('Database error:', error);
      res.status(500).send('Internal Server Error');
  }
});

  
app.put('/update_book/:id', async (req, res) => {
  const { id } = req.params;
  const { bookName, bookCategory, bookCount } = req.body;

  const q = imageAsBase64 
      ? 'UPDATE book SET bookName = ?, bookCategory = ?, bookCount = ?, bookImg = ? WHERE bookID = ?'
      : 'UPDATE book SET bookName = ?, bookCategory = ?, bookCount = ? WHERE bookID = ?';

  const values = imageAsBase64
      ? [bookName, bookCategory, bookCount, imageAsBase64, id]
      : [bookName, bookCategory, bookCount, id];

  try {
      const results = await query(q, values);
      if (results.affectedRows === 0) {
          res.status(404).json({ message: 'Book not found or no new data to update' });
      } else {
          res.status(200).json({ message: 'Book updated successfully' });
      }
  } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});
  
app.post('/create_borrow', async (req, res) => {
  const { memberID, memberName, memberSurname, bookID, bookName, borrowCurrentDate, borrowLastestDate } = req.body;
  const insertQuery = `
  INSERT INTO borrow (memberID, memberName, memberSurname, bookID, bookName, borrowCurrentDate, borrowLastestDate) 
  VALUES (?, ?, ?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d'), STR_TO_DATE(?, '%Y-%m-%d'))
`;

  try {
      const result = await query(insertQuery, [memberID, memberName, memberSurname, bookID, bookName, borrowCurrentDate, borrowLastestDate]);
      res.status(201).json({ message: 'Borrow record created successfully', borrowID: result.insertId });
  } catch (err) {
      console.error('Error creating borrow record:', err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/update_book_borrowing/:id', async (req, res) => {
  const { id } = req.params;

  const q = 'UPDATE book SET borrowing = borrowing + 1 WHERE bookID = ?';

  try {
      const results = await query(q, [id]);

      if (results.affectedRows === 0) {
          return res.status(404).json({ success: false, message: 'Book not found or already at max borrowing' });
      }

      console.log('Book borrowed successfully', results);
      return res.json({ success: true, message: 'Book borrowed successfully' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/get_borrows', async (req, res) => {
  const q = 'SELECT * FROM borrow'; 

  try {
      const results = await query(q);
      res.json(results);
  } catch (error) {
      console.error('Error fetching borrows:', error);
      res.status(500).send('Internal Server Error');
  }
});
  
app.delete('/delete_borrow/:borrow_id', async (req, res) => {
  const { borrow_id } = req.params;

  const q = 'DELETE FROM borrow WHERE borrowID = ?';

  try {
      const results = await query(q, [borrow_id]);
      if (results.affectedRows === 0) {
          return res.status(404).send('Borrow record not found');
      }
      res.send('Borrow record deleted successfully');
  } catch (error) {
      console.error('Error deleting borrow record:', error);
      res.status(500).send('Error deleting borrow record');
  }
});

app.put('/update_book_return/:book_id', async (req, res) => {
  const { book_id } = req.params;
  const { increment } = req.body;
  
  const operation = increment ? 'borrowing - 1' : 'borrowing - 1';

  const q = `UPDATE book SET borrowing = ${operation} WHERE bookID = ?`;

  try {
      const results = await query(q, [book_id]);
      if (results.affectedRows === 0) {
          return res.status(404).send('Book not found or no update made');
      }
      res.send('Book borrowing count updated successfully');
  } catch (error) {
      console.error('Error updating book borrowing count:', error);
      res.status(500).send('Error updating book borrowing count');
  }
});

app.get('/',(req,res)=>{
  res.json('server started at port '+process.env.ENV_PORT);
})
    
app.listen(process.env.ENV_PORT,() =>{
    console.log("listening..");
})