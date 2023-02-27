import React, { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {

      const host = "http://localhost:3000"
      const notesInitial = []
      const [notes , setNotes] = useState(notesInitial)

      //Get a note 

      const getNote = async () => {

        //API call
  
        const response = await fetch (`${host}/api/notes/fetchallnotes` , {
          method : "GET" , 
          headers : {
            'Content-Type' : 'application/json' ,

            "auth-token" : localStorage.getItem("token")
          },
        })
              
        const json = await response.json()
        console.log(json);
        setNotes(json)
      }

    //Add a note
    const addNote = async (title , description , tag) => {

      //API call

      const response = await fetch (`${host}/api/notes/addnote` , {
        method : "POST" , 
        headers : {
          'Content-Type' : 'application/json' ,
          "auth-token" : localStorage.getItem("token")
        },

        body : JSON.stringify({title , description , tag})
      })

      const note = await response.json()
      setNotes(notes.concat(note))

    }

    //Delete a note

    const deleteNote = async (id) => {

      const response = await fetch (`${host}/api/notes/deletenote/${id}` , {
        method : "DELETE" , 
        headers : {
          'Content-Type' : 'application/json' ,
          "auth-token" : localStorage.getItem("token")
        },
        // body m kujh nhi dengey
      })
      const json =  response.json()
      console.log(json);


      console.log("Deleting note : " + id);
      const newNote = notes.filter((note) => {return note._id!==id})
      setNotes(newNote)
    }

    //Edit a note
  
    const editNote = async (id , title , description , tag) => {
       //API call

      const response = await fetch (`${host}/api/notes/updatenote/${id}` , {
        method : "PUT" , 
        headers : {
          'Content-Type' : 'application/json' ,
          "auth-token" : localStorage.getItem("token")
        },


        body : JSON.stringify({id ,title , description , tag})
      })
      const json =  response.json()

      let newNotes = JSON.parse(JSON.stringify(notes))
     
      //Logic to edit a note 
      for (let index = 0; index < newNotes.length; index++) {
        const element = newNotes[index];
        if(element._id === id){
          newNotes[index].title=title ; 
          newNotes[index].description = description ; 
          newNotes[index].tag = tag

          break
        }
      }
      setNotes(newNotes)
    }


    return (
        <NoteContext.Provider value={{notes , addNote , deleteNote , editNote , getNote}}>
        {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState