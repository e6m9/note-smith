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
const PORT = 12942;

// middleware to handle JSON parsing, url data, and static pages
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// routes /notes to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// routes /notes to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// routes /api/notes to db.json in order to read the data
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join('./db/db.json'), 'utf8', (err, data) => {
        return err
            ? (console.error('Error reading db.json:', err), res.status(500).send('Internal Server Error'))
            : res.json(JSON.parse(data));
    });
});

// allows creation of new notes with unique ids only if there is a title and body text
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        fs.readFile('./db/db.json', 'utf8', (readErr, data) => {
            if (readErr) {
                console.error('Error reading db.json:', readErr);
                return res.status(500).json('Internal Server Error');
            }

            // sets JSON code to 'notes' so we don't have to write it so many times
            const notes = JSON.parse(data);

            // defines what a new note is using uuidv4() to generate a unique id for each new note

            const newNote = {
                title,
                text,
                id: uuidv4(),
            };

            // pushes the newNote into the parsed JSON data
            notes.push(newNote);

            // writes the notes data with the new note into db.json
            fs.writeFile('./db/db.json', JSON.stringify(notes), (err) =>
                err
                    ? console.error(err)
                    : console.log('New Note added')
            );

            // a response like this is useful for testing
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

// allows for editing individual notes in the api directly
app.put('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading db.json:', err);
            res.status(500).send('Internal Server Error');
        }
        const { title, text } = req.body;

        const notes = JSON.parse(data);

        // uses a filter to check for the id selected
        const updatedNotes = notes.map(note => {
            if (note.id === req.params.id) {
                return {
                    title,
                    text,
                    id: req.params.id,
                }
            } else {
                return note;
            }
        }
        );

        fs.writeFile('./db/db.json', JSON.stringify(updatedNotes), (writeErr) => {
            if (writeErr) {
                console.error('Error writing to db.json:', writeErr);
                res.status(500).send('Internal Server Error');
            }

            const response = {
                status: 'note updated',
            };

            console.log(response);
            res.status(200).json(response);
        });
    })
});


// allows deletion of old notes using the unique id
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading db.json:', err);
            res.status(500).send('Internal Server Error');
        }

        const notes = JSON.parse(data);

        // uses a filter to check for the id selected
        const updatedNotes = notes.filter(note => note && note.id !== req.params.id);

        // rewrites db.json when a note has been deleted
        if (updatedNotes.length < notes.length) {
            fs.writeFile('./db/db.json', JSON.stringify(updatedNotes), (writeErr) => {
                if (writeErr) {
                    console.error('Error writing to db.json:', writeErr);
                    res.status(500).send('Internal Server Error');
                }

                const response = {
                    status: 'note deleted',
                };

                console.log(response);
                res.status(200).json(response);
            });
        } else {
            res.status(404).json({ status: 'note not found' });
        }
    });
});

// routes back to the home page if an incorrect path is entered
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// allows the app to access and listen to the port
app.listen(PORT, () =>
    console.log(`Express server listening on port ${PORT}!`)
);