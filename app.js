const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.urlencoded({extended: false})); // To use req

app.use(express.static(__dirname + '/public')); // To initiate root dir

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'node1'
});

connection.connect((err) => {
  if (err) {
    console.log('Gagal menyambung!' + err.stack);
    return;
  }

  console.log('Tersambung');
});

app.get('/', (req, res) => {
  connection.query(
    'SELECT * FROM datum',
    (error, results) => {
      res.render('index.ejs', {datum: results});
    }
  )
});

// add route
app.get('/tambah', (req, res) =>{
  res.render('tambah.ejs');
});

app.post('/tambah/baru', (req, res) => {
  connection.query('INSERT INTO datum (nama) VALUES (?)',
  [req.body.dataNama],
  (error, results) => {
    res.redirect('/')
  });
});

// del route
app.post('/hapus/:id', (req, res) => {
  connection.query('DELETE FROM datum WHERE id = ?',
  [req.params.id],
  (error, results) => {
    res.redirect('/');
  });
});

// edt route
app.get('/ubah/:id', (req, res) => {
  connection.query(
    'SELECT * FROM datum WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.render('ubah.ejs', {data: results[0]}); // select the first only
    }
  )
});

app.post('/update/:id', (req, res) => {
  connection.query(
    'UPDATE datum SET nama = ? WHERE id = ?',
    [req.body.dataNama, req.params.id],
    (error, results) => {
      res.redirect('/');
    }
  )
});
app.listen(3000);