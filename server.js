const { error } = require("console");
const express = require("express");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "artists.db");

fs.mkdirSync(dataDir, { recursive: true });

const db = new sqlite3.Database(dbPath);

// Creem la taula i ens assegurem que hi hagi dades inicials.
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS artists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

    db.run(`
      CREATE TABLE IF NOT EXISTS albums (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        year INTEGER,
        artist_id INTEGER,
        FOREIGN KEY (artist_id) REFERENCES artists(id)
      )
    `);

  db.get("SELECT id FROM artists WHERE name = ?", ["Txarango"], (error, row) => {
    if (error) {
      console.log("Error comprovant dades inicials:", error.message);
      return;
    }

    if (!row) {
      db.run("INSERT INTO artists (name) VALUES (?)", ["Txarango"]);
    }
  });

  db.get("SELECT id FROM artists WHERE name = ?", ["Oques Grasses"], (error, row) => {
    if (error) {
      console.log("Error comprovant dades inicials:", error.message);
      return;
    }

    if (!row) {
      db.run("INSERT INTO artists (name) VALUES (?)", ["Oques Grasses"]);
    }
  });
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


app.post("/api/AddArtist",  (req, res) => {
  const name = req.body.data;
  db.run("INSERT INTO artists (name) VALUES (?)", [name], (error) => {
    if (error) {
      res.status(500).type("text").send(`Error: ${error.message}`);
      return;
    }
    res.status(201).type("text").send(`Artista desat: ${name}`);
  });
});


app.post("/api/select", (req, res) => {
  let table = req.body.table;
  let camp = req.body.camp;
  let dat1 = req.body.dat1;
  let valor = req.body.valor;
  let sql = `SELECT * FROM ${table} WHERE ${camp} = ?`;
});
  db.all(sql, [dat1, valor], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ result: rows });
});

app.post("/api/artists",  (req, res) => {
  const table = req.body.data;
  db.all(`SELECT * FROM ${table} ORDER BY id DESC`, (err, rows) => {
    if (err){
      return res.status(500).json({ error: err.message });
    }
    console.log(rows);
    res.json({ result: rows });
  });
});

app.post("/api/afegirAlbum", (req, res) => {
  const { title, year, artist_id } = req.body.data;
  db.run("INSERT INTO albums (title, year, artist_id) VALUES (?, ?, ?)", 
    [title, year, artist_id], 
    (error) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json({ result: "Àlbum afegit correctament" });
    }
  );
});

app.post("/api/albums", (req, res) => {
  db.all(`SELECT a.*, art.name FROM albums a JOIN artists art ON a.artist_id = art.id ORDER BY a.id DESC`,
    (err, rows) => res.json({ result: rows })
  );
});

app.get("/api/artists", (req, res) => {
  db.all("SELECT id, name FROM artists ORDER BY name", (err, rows) => {
    res.json({ result: rows });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor a http://localhost:${PORT}`);
  console.log(`Base de dades SQLite: ${dbPath}`);
});
