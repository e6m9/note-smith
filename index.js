// learn how to use Heroku

// GET on notes button to open notes page
// GET for save note and clear form buttons to appear after text has been entered into the note field
// POST for save note button to save to local storage and print on page with previous notes && for the save note button and clear form button to disappear
// GET on note fields to, on click, move back to the input area for editing && a new note button appears
// GET for new note button to clear edit fields and button disappears
// GET on clear form button to do the same as the new note button
// DELETE for delete note button

// imports packages
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;