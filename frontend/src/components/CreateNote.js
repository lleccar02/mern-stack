import React, { Component } from 'react'
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default class CreateNote extends Component {

  state = {
    users: [],
    userSelected: '',
    date: new Date(),
    title: '',
    content: '',
    editing: false,
    _id: ''
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers = async () => {
    const res = await axios.get('http://localhost:4000/api/users');
    await this.setState({
      users: res.data.users,
      userSelected: res.data.users[0].username
    });
  }


  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
    console.log(this.state);
  }

  onDateChange = date => {
    this.setState({date});
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const note = {
      author: this.state.userSelected,
      title: this.state.title,
      content: this.state.content,
      date: this.state.date
    }
    if(this.state.editing) {
      await axios.put('http://localhost:4000/api/notes/' + this.state._id, note)
    } else {
      await axios.post('http://localhost:4000/api/notes', note);
    }
    window.location.href = '/';
  }

  render() {
    return (
      <div className="col-md-6 offset-md-3">
        <div className="card card-body">
          <h4>Create Note</h4>
          <br />
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <select name="userSelected" className="form-control" onChange={this.onInputChange}>
                {
                  this.state.users.map(user => 
                    <option key={user._id} value={user.username}>
                      {user.username}
                    </option>
                  )
                }
              </select>
            </div>
            <br />

            <div className="form-group">
              <input type="text" className="form-control" placeholder="Title" name="title" onChange={this.onInputChange} required/>
            </div>
            <br />

            <div className="form-group">
              <textarea className="form-control" placeholder="Content" name="content" onChange={this.onInputChange} required></textarea>
            </div>
            <br />

            <div className="form-group">
              <DatePicker 
                className="form-control" 
                selected={this.state.date} 
                onChange={this.onDateChange}
                value={this.state.date}
              />
            </div>
            <br />

            <button type="submit" className="btn btn-primary btn-block">Save</button>
          </form>
        </div>
      </div>
    )
  }
}
