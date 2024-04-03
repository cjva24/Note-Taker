const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// middleware to handle JSON data
app.use(express.static(path.join(__dirname, 'Develop','public')));
app.use(express.json());

// adding db.json file path
const dbFilePath = path.join(__dirname, 'Develop', 'db', 'db.json');


// landing page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop', 'public', 'index.html'));
});

// notes page route
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop', 'public', 'notes.html'));
});

// api routes

// returns saved notes
app.get('/api/notes', (req, res) => {
    fs.readFile(dbFilePath, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({error: 'Server Error'});
        } else {
            const notes = JSON.parse(data);
            res.json(notes);
        }
    });
});

// saves new notes to db.json file
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();
    fs.readFile(dbFilePath, 'utf-8', (err, data) => {
        if(err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error'});
        } else {
            const notes = JSON.parse(data);
            notes.push(newNote);
            fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
                if(err) {
                    console.error(err);
                    res.status(500).json({ error: 'Server Error'});
                } else {
                    res.json(newNote);
                }
            });
        }
    });
});

// starting the server
app.listen(PORT, () => {
    console.log(`Server is active on http://localhost:${PORT}`);
});