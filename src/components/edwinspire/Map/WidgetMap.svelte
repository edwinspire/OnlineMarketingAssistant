<script>
  //import 'ol/ol.css';
  import Feature from "ol/Feature";
  import Map from "ol/Map";
  import Point from "ol/geom/Point";
  //import Select from 'ol/interaction/Select';
  import VectorSource from "ol/source/Vector";
  import OSM from "ol/source/OSM";
  import View from "ol/View";
  import * as Geom from "ol/geom";
  import * as Proj from "ol/proj";
  import { Icon, Style } from "ol/style";
  import TileLayer from "ol/layer/Tile";
  import VectorLayer from "ol/layer/Vector";
  
import {Attribution, defaults as defaultControls} from 'ol/control';

  import { onMount } from "svelte";

  
  let map;
  let mapContainer;
  var vectorSource;


  export let points = [];
  export let zoom = 16;
  export let center = [0, 0];



  let viewMap = new View({
        center: center,
        zoom: zoom,
      });

      function checkSize(ev) {
  console.log(ev);
}

  onMount(() => {
    console.log("WMaps", points);

    window.addEventListener('resize', checkSize);
    checkSize();

    var VLayer = new VectorLayer({
      style: function (feature) {
        return feature.get("style");
      },
      source: new VectorSource({ features: [] }),
    });

      vectorSource = VLayer.getSource();


    var map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        VLayer,
      ],
      target: mapContainer,
      controls:  defaultControls({
        attribution: false, // Oculta las atribuciones, como el texto OpenStreetMaps Contributor
    }),
      //target: document.getElementById( "mapContainer"),
      view: viewMap,
    });

    /*
var selectStyle = {};
var select = new Select({
  style: function (feature) {
    var image = feature.get('style').getImage().getImage();
    if (!selectStyle[image.src]) {
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0, image.width, image.height);
      var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      var data = imageData.data;
      for (var i = 0, ii = data.length; i < ii; i = i + (i % 4 == 2 ? 2 : 1)) {
        data[i] = 255 - data[i];
      }
      context.putImageData(imageData, 0, 0);
      selectStyle[image.src] = createStyle(undefined, canvas);
    }
    return selectStyle[image.src];
  },
});
map.addInteraction(select);


map.on('pointermove', function (evt) {
  console.log(evt);
  map.getTargetElement().style.cursor = map.hasFeatureAtPixel(evt.pixel)
    ? 'pointer'
    : '';
});
*/



    map.on("dblclick", function (evt) {
      console.log('Doble click', evt.coordinate);
      //addMarker( Proj.transform(evt.coordinate, "EPSG:3857", "EPSG:4326")    );
    });


    if (points && Array.isArray(points)) {
      points.forEach((element) => {
        addMarker(
          element.geolocation
        );
      });
    } else {
      console.log("Points no es valido", points);
    }
  });


  function createStyle(src, img) {
      return new Style({
        image: new Icon({
          anchor: [0.5, 0.96],
          //crossOrigin: "anonymous",
          src: src,
          img: img,
          imgSize: img ? [img.width, img.height] : undefined,
        }),
      });
    }



  function addMarker(coordinates) {
      let coord = Proj.transform(coordinates, "EPSG:4326", "EPSG:3857")
      console.log(coordinates, coord);
      var marker = new Feature(new Geom.Point(coord));
      var zIndex = 1;
      marker.setStyle(createStyle("img/icon.png", undefined));
      vectorSource.addFeature(marker);
      //viewMap.center = coord;
      viewMap.animate({zoom: zoom}, {center: coord});
    }




</script>

<style>
.mapw {
    height: 100%;
    width: 100%;
  }
</style>

<div class="mapw" bind:this={mapContainer}/>
