import { useEffect, useState, useRef } from 'react'

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import './App.css'

function App() {
  const mapRef = useRef(null);

  useEffect(() => {
    if(mapRef.current) return;

    mapRef.current = new Map({
    target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
  })

  return (
    <div id = "map"></div>
  )
}

export default App
