import React from 'react';
import axios from 'axios';
import { SimpleCache } from 'simple-cache-provider';


function fetchPlanet(id) {
    return axios.get(`https://swapi.co/api/planets/${id}/`)
}

export default function PlanetPage(props) {
    return (
        <React.Timeout>
          {loading => (loading ? <div>Loading planet...</div> : (
            <SimpleCache>
              {cache => {
                const data = cache.read(Cache, `PlanetDetails.api.${props.id}`, () => fetchPlanet(props.id));
                return (
                    <div>
                        <h4 onClick={props.onBackClick}>Go back</h4>
                        Name: {data.data.name}<br />
                        Terrain: {data.data.terrain}
                    </div>
                )
              }}
            </SimpleCache>
          ))}
        </React.Timeout>
    )
}
