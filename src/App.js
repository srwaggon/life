import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {database} from './Firebase';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      input: '',
      priorities: []
    };
  }

  componentDidMount = () => {
    this.fetchPriorities();
  }

  fetchPriorities = () => {
    database.ref('/priorities').on('value', snapshot => {
      this.updatePriorities(snapshot.val() || []);
    });
  }

  updatePriorities = (priorities) => {
    this.setState({priorities});
  }

  onUpdateInput = (event) => {
      this.setState({input: event.target.value});
  }

  onSubmitPriority = event => {
    event.preventDefault();
    this.addPriority(this.state.input)
    this.setState({input: ''});
  }

  addPriority = (text) => {
    let newId = this.state.priorities.length;
    database.ref('/priorities').push().set(text);
  }

  deletePriority = (id) => {
    return () => {
      database.ref('/priorities/' + id).set(null);
    }
  }

  getPrioritiesList() {
    return Object.keys(this.state.priorities).map((id) => {
      return (
        <li key={`li-${id}`}>
          {this.state.priorities[id]} <span onClick={this.deletePriority(id)}>[x]</span>
        </li>
      );
    });
  }

  render() {
    return (
      <div className="App">
        <h1>Let My People Go</h1>
        <form onSubmit={this.onSubmitPriority}>
          <input type="text" value={this.state.input} onChange={this.onUpdateInput} placeholder="Priority"/>
          <input type="submit" value="add" />
        </form>
        <ul>
          {this.getPrioritiesList()}
        </ul>
      </div>
    );
  }
}

export default App;