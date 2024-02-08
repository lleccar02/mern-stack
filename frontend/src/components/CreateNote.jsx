import { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateNote = () => {

  const id = useParams().id;

  const formTitle = id ? 'Edit Note' : 'Create Note';

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [userSelected, setUserSelected] = useState('');
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editing, setEditing] = useState(false);
  const [_id, setId] = useState('');


  useEffect(() => {
    getUsers();
    if(id) {
      getUser(id);
      setEditing(true);
      setId(id);
    }
  }, []);

  const getUsers = async () => {
    const res = await axios.get('http://localhost:4000/api/users');
    setUsers(res.data.users);
    setUserSelected(res.data.users[0].username);
  };

  const getUser = async (id) => {
    const res = await axios.get(`http://localhost:4000/api/notes/${id}`);
    setUserSelected(res.data.note.author);
    setTitle(res.data.note.title);
    setContent(res.data.note.content);
    setDate(new Date(res.data.note.date));
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'userSelected') setUserSelected(value);
    if (name === 'title') setTitle(value);
    if (name === 'content') setContent(value);
  };

  const onDateChange = date => {
    setDate(date);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const note = {
      author: userSelected,
      title: title,
      content: content,
      date: date
    };
    if (editing) {
      await axios.put(`http://localhost:4000/api/notes/${_id}`, note);
    } else {
      await axios.post('http://localhost:4000/api/notes', note);
    }
    navigate('/');
  };

  return (
    <div className="col-md-6 offset-md-3">
      <div className="card card-body">
        <h4>{formTitle}</h4>
        <br />
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <select name="userSelected" className="form-control" value={userSelected} onChange={onInputChange}>
              {users.map(user =>
                <option key={user._id} value={user.username}>
                  {user.username}
                </option>
              )}
            </select>
          </div>
          <br />

          <div className="form-group">
            <input type="text" className="form-control" placeholder="Title" name="title" value={title} onChange={onInputChange} required />
          </div>
          <br />

          <div className="form-group">
            <textarea className="form-control" placeholder="Content" name="content" value={content} onChange={onInputChange} required></textarea>
          </div>
          <br />

          <div className="form-group">
            <DatePicker
              className="form-control"
              selected={date}
              onChange={onDateChange}
              value={date}
            />
          </div>
          <br />

          <button type="submit" className="btn btn-primary btn-block">Save</button>
        </form>
      </div>
    </div>
  );
};

export default CreateNote;
