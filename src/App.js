import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import { createCache, createResource } from 'simple-cache-provider';
import axios from 'axios';
import './App.css';

const cache = createCache(Symbol('CacheDemo'));

function createFetcher(fetch) {
  const res = createResource(fetch);
  return (...args) => res(cache, ...args);
}

function Placeholder(props) {
  return (
    <React.Timeout>
      {loading => loading ? props.placeholder : props.children}
    </React.Timeout>
  )
}

const fetchPlanetPage = createFetcher(
  () => import('./PlanetPage'),
);

function PlanetPageLoader(props) {
  const PlanetPage = fetchPlanetPage().default;
  return (
    <PlanetPage {...props} />
  );
}

function PlanetListItem({ name, url, onClick, ...rest }) {
  const [, id] = url.match(/https:\/\/swapi.co\/api\/planets\/([0-9]+)/);
  return (
    <div onClick={() => onClick(id)}>
      <h4>{name}</h4>
    </div>
  );
}

const fetchPlanets = createFetcher(
  () => axios.get('https://swapi.co/api/planets'),
);

function PlanetList({ onClick }) {
  const { data } = fetchPlanets();
  return data.results.map(result =>
    <PlanetListItem
      key={result.url}
      onClick={onClick}
      {...result}
    />
  );
}

class App extends Component {

  state = {
    currentId: null,
    showDetail: false,
  };

  deferSetState(state) {
    ReactDOM.unstable_deferredUpdates(() => {
      this.setState(state);
    });
  }

  onPlanetClick = (id) => {
    this.setState({
        currentId: id,
    });
    this.deferSetState({
      showDetail: true,
    });
  }

  onBackClick = () => {
    this.setState({
        currentId: null,
        showDetail: false,
    });
  }

  renderDetail(id) {
    return (
      <Placeholder
        placeholder={<div>Loading planet page component</div>}
      >
        <PlanetPageLoader
          id={id}
          onBackClick={this.onBackClick}
        />
      </Placeholder>
    );
  }

  renderList() {
    return (
      <Placeholder
        placeholder={<div>Loading planets...</div>}
      >
        <PlanetList onClick={this.onPlanetClick} />
      </Placeholder>
    );
  }

  render() {
    const { showDetail, currentId } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        {showDetail ?
            this.renderDetail(currentId) :
            this.renderList()}
      </div>
    );
  }
}

export default App;
