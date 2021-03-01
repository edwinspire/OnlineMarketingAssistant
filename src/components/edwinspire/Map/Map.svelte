<script>
  import { FetchData } from "../FetchData.js";
  import WMap from "./WidgetMap.svelte";

  import { onMount } from "svelte";
  import { DEFAULT_TILE_SIZE } from "ol/tilegrid/common";
  let points = [];
  let GeoLatitude = 0;
  let GeoLongitude = 0;
  let FData = new FetchData();
  let promise = new Promise(
    () => {},
    () => {}
  );

  async function GetEventsAround(search) {
    let query = { latitude: GeoLatitude, longitude: GeoLongitude };
    const res = await FData.get("/pgapi/v2/events/around", query, {
      "Content-Type": "application/json",
    });

    if (res.ok) {
      let events = await res.json();
      console.log(events);
      points = events.map((event) => {
        return {
          geolocation: [
            event.longitude,
            event.latitude,
          ],
        };
      });

      return true;
    } else {
      throw new Error("No se pudo cargar la información");
    }
  }

  function GeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        GeoLatitude = position.coords.latitude;
        GeoLongitude = position.coords.longitude;
        promise = GetEventsAround();
      });
    } else {
      console.log("No se pudo obtener las coordenadas");
    }
  }

  onMount(async () => {
    GeoLocation();
  });
</script>

<style>
  .general_map {
    height: 100vh;
    width: 100%;
  }
</style>

{#await promise}
  <p>...Cargando</p>
{:then Result}
  <div class="general_map">
    <WMap {points} />
  </div>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
