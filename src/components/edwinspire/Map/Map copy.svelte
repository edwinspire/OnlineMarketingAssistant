<style>
  .map{
      height: 800px;
      width: 100%;
  }
</style>

<script>
import Map from 'ol/Map';
import View from 'ol/View';
import Geolocation from 'ol/Geolocation';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import {onMount} from 'svelte';
let viewMap;
let map;
let geox = 0;
let geoy = 0;
onMount(()=>{
  viewMap = new View({
      center: olProj.fromLonLat([-0.2290951, -78.41833539999999]),
      zoom: 5
    });
          // create a Geolocation object setup to track the position of the device
          var geolocation = new Geolocation({
      tracking: true
    });
console.log(geolocation);
    // bind the projection to the view so that positions are reported in the
    // projection of the view
    //geolocation.bindTo('projection', viewMap);
    // bind the marker's position to the geolocation object, the marker will
    // move automatically when the GeoLocation API provides position updates
    //marker.bindTo('position', geolocation);
    // when the GeoLocation API provides a position update, center the view
    // on the new position
    geolocation.on('change:position', ()=> {
      var p = geolocation.getPosition();
      console.log(p[0] + ' : ' + p[1]);
      viewMap.setCenter([parseFloat(p[1]), parseFloat(p[0])]);
      map.render();
    });
  
map = new Map({
    target: 'hotel_map',
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: viewMap
  });
});
</script>



<div class="map" id="hotel_map"></div>