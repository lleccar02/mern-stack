import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';

const NotesList = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    const res = await axios.get('http://localhost:4000/api/notes');
    setNotes(res.data.notes);
  };

  const deleteNote = async (id) => {
    await axios.delete(`http://localhost:4000/api/notes/${id}`);
    getNotes();
  };

  return (
    <div className="row">
      {notes.map(note => (
        <div className="col-md-4 p-2" key={note._id}>
          <div className="card">
            <div className="card-header d-flex justify-content-between">
              <h5>{note.title}</h5>
              <Link className="nav-link" to={`/edit/${note._id}`}>
                Edit
              </Link>
            </div>
            <div className="card-body">
              <p>{note.content}</p>
              <p>{note.author}</p>
              <p>
                <TimeAgo date={note.date} />
              </p>
            </div>
            <div className="card-footer">
              <button
                className="btn btn-danger"
                onClick={() => deleteNote(note._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesList;