import React , {useContext , useState} from "react";
import NoteContext from "../Context/notes/NoteContext";

const AddNote = (props) => {
    const context = useContext(NoteContext);
    const { notes, addNote } = context;

    const [note , setNote] = useState({title : "" , description : "" , tag : ""})

    const handleClick = (e) => {

        e.preventDefault()
        addNote(note.title , note.description , note.tag)

        setNote({title : "" , description : "" , tag : ""})
        props.showAlert("Added Successfully" , "success")
    }

    const onChange = (e) => {

        setNote({...note , [e.target.name] : e.target.value})

    }

  return (
    <div className="container my-3">
      <h2>Add a note</h2>
      <form className="my-3">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            value={note.title}
            id="title"
            name="title"
            aria-describedby="emailHelp"
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            className="form-control"
            value={note.description}
            id="description"
            name="description"
            onChange={onChange}
            minLength={5}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tag">Tag</label>
          <input
            type="text"
            className="form-control"
            value={note.tag}
            id="tag"
            name="tag"
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary my-4" onClick={handleClick}>
          Add Note
        </button>
      </form>
    </div>
  );
};

export default AddNote;
