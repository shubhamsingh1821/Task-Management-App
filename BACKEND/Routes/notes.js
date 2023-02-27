const express = require("express");
const router = express.Router();
const Note = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require('express-validator');

//Route -1 : Get all the notes using GET /api/notes/fetchallnotes .Logn required .
router.get("/fetchallnotes", fetchuser, async (req, res) => {

  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error")
  }
});

//Route -2 : Add all the notes using POST /api/notes/addnotes .Logn required .
router.post('/addnote', [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),],fetchuser, async (req, res) => {
        try {


            const { title, description, tag } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const savedNote = await note.save()

            res.json(savedNote)


        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })


// Route - 3 Update an existing note using PUT "/api/notes/updatenote/:id" , login required , 
router.put('/updatenote/:id',fetchuser, async (req, res) => {
          const {title , description , tag} = req.body

          try {
            const newNote = {}

          if(title){newNote.title=title}
          if(description){newNote.description=description}
          if(tag){newNote.tag=tag}


          let note = await Note.findById(req.params.id)
          if(!note){return res.status(400).send("Not found")}

          if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not allowed");
          }
          note = await Note.findByIdAndUpdate(req.params.id , {$set : newNote} ,{new : true}) 
            res.json({note})
          } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
          }
          
      })

 // Route - 4 Update an existing note using DELETE "/api/notes/deletenote/:id" ,
router.delete('/deletenote/:id',fetchuser, async (req, res) => {

  try {
    //Find the note to be deleted and delete it
  let note = await Note.findById(req.params.id)
  if(!note){return res.status(400).send("Not found")}

  //Allow deletion only if user owns the note
  if(note.user.toString() !== req.user.id){
    return res.status(401).send("Not allowed");
  }

  note = await Note.findByIdAndDelete(req.params.id) 
    res.json({"Success" : "Note has been deleted" , note : note})
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
  
})

module.exports = router;
