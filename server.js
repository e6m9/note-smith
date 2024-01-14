// imports express as a framework for unifying backend with frontend functionality
const express = require('express');
const app = express();

// imports uuid in order to generate unique id's for new notes
const { v4: uuidv4 } = require('uuid')

// imports fs in order to read and write files and their information
const fs = require('fs');

// imports path to allow connecting between backend and frontend
const path = require('path');

// sets the port to 3001
const PORT = 3001;

// middleware to handle JSON parsing, url data, and static pages
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//routes

// routes /notes to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// routes api/notes to db.json in order to read the data
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join('./db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading db.json:', err);
            return res.status(500).send('Internal Server Error');
        } else {
            res.json(JSON.parse(data));
        }
    })
});

// allows creation of new notes with unique ids
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {

        fs.readFile('./db/db.json', 'utf8', (readErr, data) => {
            if (readErr) {
                console.error('Error reading db.json:', readErr);
                res.status(500).json('Internal Server Error');
            }

            const notes = JSON.parse(data);

            const newNote = {
                title,
                text,
                id: uuidv4(),
            };

            notes.push(newNote);

            fs.writeFile('./db/db.json', JSON.stringify(notes), (err) =>
                err
                    ? console.error(err)
                    : console.log(
                        'New Note added'
                    )
            );

            const response = {
                status: 'note created',
                body: newNote,
            };

            console.log(response);
            res.status(201).json(response);
        });

    } else {
        res.status(400).json('Error: Title and Text required');
    }
});


app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading db.json:', err);
            res.status(500).send('Internal Server Error');
        }

        const notes = JSON.parse(data);

        const updatedNotes = notes.filter(note => note && note.id !== req.params.id);

        if (updatedNotes.length < notes.length) {
            fs.writeFile('./db/db.json', JSON.stringify(updatedNotes), (writeErr) => {
                if (writeErr) {
                    console.error('Error writing to db.json:', writeErr);
                    res.status(500).send('Internal Server Error');
                }
                res.status(200).json({ status: 'note deleted' });
            });
        } else {
            res.status(404).json({ status: 'note not found' });
        }
    });
});

// error route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// allowsn the app to access the port
app.listen(PORT, () =>
    console.log(`Express server listening on port ${PORT}!`)
);