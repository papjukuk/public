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
      name: 'Java 기반 시스템 유지보수 업무를 수행한 경험이 있습니다. 처음에는 매주 정해진 일정에 맞춰 데이터를 반영해야 하는 업무가 부담으로 느껴지고, 시스템 구조를 충분히 이해하지 못한 상태에서 일을 진행하는 것도 쉽지 않았습니다. 혼자 고민하기보다는 선임자에게 먼저 다가가 팀에 자연스럽게 녹아드는 방법을 선택했습니다. 선임분들이 번거롭게 여기는 잡무와 보조 업무를 주도적으로 맡으며, 그 과정에서 선임자와의 소통이 자연스럽게 늘어났고 시스템 구조와 업무 흐름을 깊이 이해할 수 있었습니다. 또한 주간보고와 중간보고를 통해 진행 상황을 공유하는 습관을 익히며, 일정에 맞춰 안정적으로 업무를 운영하는 것이 중요하다는 것을 배웠습니다. 이러한 경험을 통해 배운 적극적인 태도로, 모르는 부분은 먼저 질문하며 배우고 남들이 꺼리는 업무도 솔선수범해 맡으며 팀에 자연스럽게 녹아드는 구성원이 되겠습니다',
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
