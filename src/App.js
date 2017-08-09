import React, { Component } from 'react';
import './App.css';

import {database} from './Firebase';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      input: '',
      priorities: [],
      title: '',
    };
  }

  componentDidMount = () => {
    this.fetchTitle();
    this.fetchPriorities();
  }

  fetchTitle = () => {
    database.ref('/title')
      .once('value').then(snapshot => {
        this.setState({title: snapshot.val()});
      });
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

  handleUpvote = (data) => {
    const id = data.id;
    const priority = data.priority;

    database
      .ref(`/priorities/${id}`)
      .update({ votes: priority.votes + 1 });
  }

  render() {
    const priorities = this.state.priorities.map(priority => {
      return (
        <Priority priority={priority} onUpvote={this.handleUpvote} key={priority.id} />
      );
    });

    return (
      <div className="app">
        <h1 className="title">{this.state.title}</h1>
        <form onSubmit={this.onSubmitPriority} className="form">
          <input
            type="text" value={this.state.input} onChange={this.onUpdateInput}
            placeholder="Anything goes..." className="input" autoFocus required
          />
          <input type="submit" value="" className="submit" />
        </form>
        <hr />
        <ol className="priorities">
          {priorities}
        </ol>
      </div>
    );
  }
}

class Priority extends Component {
  handleUpvoteClick = (e) => {
    this.props.onUpvote(this.props.priority);
  }

  render() {
    const id = this.props.priority.id;
    const priority = this.props.priority.priority;
    const votes = priority.votes;

    return (
      <li key={`li-${priority.id}`} className="priority">
        <p className="priority__text">{priority.text}</p>
        <button className="button" onClick={this.handleUpvoteClick}>
          <img className="icon" src="/arrow.svg" alt="vote" />
          <span className="button__text">{votes}</span>
        </button>
      </li>
    );
  }
}

export default App;
