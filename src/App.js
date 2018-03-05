import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import { SimpleCache } from 'simple-cache-provider';
import axios from 'axios';
import './App.css';


const Cache = Symbol('Cache');

function fetchPlanets() {
  return axios.get('https://swapi.co/api/planets')
}

function PlanetPageLoader(props) {
  return (
    <React.Timeout>
      {loading => (loading ? props.placeholder : (
        <SimpleCache>
          {cache => {
            const PlanetPage = cache.read(Cache, 'PlanetsPage.component', () => import('./PlanetPage')).default;
            return <PlanetPage {...props} />
          }}
        </SimpleCache>
      ))}
    </React.Timeout>
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

function PlanetList({ data, onClick }) {
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
      <PlanetPageLoader
        id={id}
        onBackClick={this.onBackClick}
        placeholder={<span>Loading component</span>}
      />
    );
  }

  renderList() {
      return (
        <React.Timeout>
          {loading => (loading ? <div>Loading planets...</div> : (
            <SimpleCache>
              {cache => {
                const data = cache.read(Cache, 'PlanetList.api', () => new Promise(resolve => {
                  setTimeout(() => {
                    fetchPlanets().then(resolve);
                  }, 4000);
                }));
                return <PlanetList onClick={this.onPlanetClick} data={data.data} />;
              }}
            </SimpleCache>
          ))}
        </React.Timeout>
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
