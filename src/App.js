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
    database.ref('/priorities')
    .orderByChild('votes')
    .on('value', snapshot => {
      let priorities = [];

      snapshot.forEach(priority => {
        let foo = {id: priority.key, priority: priority.val()};
        priorities = [foo].concat(priorities);
      });

      this.updatePriorities(priorities || []);
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
    database.ref('/priorities').push().set({ text, votes: 1 });
  }

  deletePriority = id => {
    return () => {
      database.ref('/priorities/' + id).set(null);
    }
  }

  upvote = (id, votes) => {
    return () => {
      database.ref('/priorities/' + id + '/votes/').set(votes + 1);
    }
  }

  getPrioritiesList() {
    return this.state.priorities.map(({id, priority}) => {
      let votes = priority.votes;
      return (
        <li key={`li-${id}`}>
           <button onClick={this.upvote(id, votes)}>upvote</button> ({votes}) {priority.text}
        </li>
      );
    });
  }

  render() {
    return (
      <div className="App">
        <h1>What's important to you?</h1>
        <form onSubmit={this.onSubmitPriority}>
          <input type="text" required value={this.state.input} onChange={this.onUpdateInput} placeholder="Life Priority"/>
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