// learn how to use Heroku

// GET on notes button to open notes page
// GET for save note and clear form buttons to appear after text has been entered into the note field
// POST for save note button to save to local storage and print on page with previous notes && for the save note button and clear form button to disappear
// GET on note fields to, on click, move back to the input area for editing && a new note button appears
// GET for new note button to clear edit fields and button disappears
// GET on clear form button that clears edit fields, does the same as new note button
// DELETE for delete note button

// imports packages
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = 3001;

// declare html elements as variables 
var titleField = document.getElementByClassName('note-title');
var noteField = document.getElementByClassName('note-textarea');

// middleware to handle JSON parsing and url data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//functions

// clears edit fields
const clearState = (req, res) => {
    titleField: '';
    noteField: '';
}

// joins the notes button to the notes html page
const notesButton = (req, res) => {
    res.sendFile(path.join(__dirname, 'notes.html'))
    // if notes, then post?
}

// joins the 404 state to the homepage
const oopsState = (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
}

// makes buttons appear
const buttonShow = (req, res) => {

}

// posts notes to left hand column
const saveNote = (req, res) => {

}

// moves saved note to edit column
const editNote = (req, res) => {
    
}

// clears edit fields
const noteFieldReset = (req, res) => {

}

// clears edit fields
const newNote = (req, res) => {

}

// deletes note
const deleteButton = (req, res) => {

}

//routes

// clear fields syntax
app.post('/clear-form', '/save-note',
clearState,
);

// error route
app.get('*',
oopsState
);

app.get('/notes',
notesButton
);

app.get('api/notes',
);

app.post('api/notes',
);

app.delete('api/notes/:id',
);

// allowsn the app to access the port
app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);