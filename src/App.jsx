import { useEffect, useState, useRef } from 'react'

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';

import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import Feature from 'ol/Feature.js'
import Point from 'ol/geom/Point.js'
import Icon from 'ol/style/Icon.js'
import Style from 'ol/style/Style.js'
import { useGeographic } from 'ol/proj.js'


import './App.css'

function App() {
  const mapRef = useRef(null);

  const [popupInfo, setPopupInfo] = useState(null) //팝업상태

  /// 추가 - 마커 생성
    const iconFeature = new Feature({
      geometry: new Point([127.033045, 37.600488]),
      name: 'Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/jsx". Strict MIME type checking is enforced for module scripts per HTML spec.',
    })
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'icon.svg',
      }),
    })
    iconFeature.setStyle(iconStyle)

    const vectorSource = new VectorSource({ features: [iconFeature] })
    const vectorLayer = new VectorLayer({ source: vectorSource })

  useEffect(() => {
    if(mapRef.current) return;
    useGeographic()
    mapRef.current = new Map({
    target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: [127.033045, 37.600488],
        zoom: 18,
      }),
    });

      mapRef.current.on('click', function(evt) {
        
      const feature = mapRef.current.forEachFeatureAtPixel(evt.pixel, f => f)
      mapRef.current.on('pointermove', function(e) {
      const hit = mapRef.current.hasFeatureAtPixel(e.pixel)
      mapRef.current.getTargetElement().style.cursor = hit ? 'pointer' : ''

      if (!feature) {
        setPopupInfo(null)
        return
      }
      setPopupInfo({ name: feature.get('name') })
    })
  })
    
    })

return (
  <div>
    <div id="map" style={{ width: '100%', height: '100vh' }}></div>
    {popupInfo && (
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '52%',
        transform: 'translateY(-50%)',
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
        border: '1px solid #eee',
        width: '25vw',
        height: '25vh',
      }}>
        📍 {popupInfo.name}
      </div>
    )}
  </div>
)
}

export default App
