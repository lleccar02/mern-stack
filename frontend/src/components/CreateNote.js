import React, { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateNote = () => {

  const id = useParams().id;

  const navigate = useNavigate();

  const [state, setState] = useState({
    users: [],
    userSelected: '',
    date: new Date(),
    title: '',
    content: '',
    editing: false,
    _id: ''
  });

  useEffect(() => {
    getUsers();
    if(id) {
      getUser(id);
      setState(prevState => ({
        ...prevState,
        editing: true,
        _id: id
      }));
    }
  }, []);

  const getUsers = async () => {
    const res = await axios.get('http://localhost:4000/api/users');
    setState(prevState => ({
      ...prevState,
      users: res.data.users,
      userSelected: res.data.users[0].username
    }));
  };

  const getUser = async (id) => {
    const res = await axios.get(`http://localhost:4000/api/notes/${id}`);
    setState(prevState => ({
      ...prevState,
      userSelected: res.data.note.author,
      title: res.data.note.title,
      content: res.data.note.content,
      date: new Date(res.data.note.date),
    }));
    
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const onDateChange = date => {
    setState(prevState => ({
      ...prevState,
      date
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const note = {
      author: state.userSelected,
      title: state.title,
      content: state.content,
      date: state.date
    };
    if (state.editing) {
      await axios.put(`http://localhost:4000/api/notes/${state._id}`, note);
    } else {
      await axios.post('http://localhost:4000/api/notes', note);
    }
    navigate('/');
  };

  return (
    <div className="col-md-6 offset-md-3">
      <div className="card card-body">
        <h4>Create Note</h4>
        <br />
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <select name="userSelected" className="form-control" value={state.userSelected} onChange={onInputChange}>
              {state.users.map(user =>
                <option key={user._id} value={user.username}>
                  {user.username}
                </option>
              )}
            </select>
          </div>
          <br />

          <div className="form-group">
            <input type="text" className="form-control" placeholder="Title" name="title" value={state.title} onChange={onInputChange} required />
          </div>
          <br />

          <div className="form-group">
            <textarea className="form-control" placeholder="Content" name="content" value={state.content} onChange={onInputChange} required></textarea>
          </div>
          <br />

          <div className="form-group">
            <DatePicker
              className="form-control"
              selected={state.date}
              onChange={onDateChange}
              value={state.date}
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
