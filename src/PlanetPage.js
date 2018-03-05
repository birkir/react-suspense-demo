import React from 'react';
import axios from 'axios';
import { createCache, createResource } from 'simple-cache-provider';

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

const fetchPlanet = createFetcher(
    (id) => axios.get(`https://swapi.co/api/planets/${id}/`),
);

export default function PlanetPage(props) {
    const { data } = fetchPlanet(props.id);
    return (
        <Placeholder>
            <div>
                <h4 onClick={props.onBackClick}>Go back</h4>
                Name: {data.name}<br />
                Terrain: {data.terrain}
            </div>
        </Placeholder>
    );
}
