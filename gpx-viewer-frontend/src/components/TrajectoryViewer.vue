<script setup lang="ts">
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import DateTimeLabel from "./DateTimeLabel.vue";
import { onMounted, watch, ref } from "vue";
import type { Ref } from "vue";

const props = defineProps<{
  playingTS: number;
  trajectoryData: {
    points: {
      lat: number;
      lng: number;
      time: number;
      ele: number;
      spd: number;
    }[];
  };
}>();

let marker: L.Marker | undefined;
let map: L.Map | undefined;
const currentElevation: Ref<number | undefined> = ref(undefined);
const currentSpeed: Ref<number | undefined> = ref(undefined);

onMounted(() => {
  // Initialize the map
  map = L.map("viewer_map", {
    keyboard: false,
  }).setView([0, 0], 2);
  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  L.control
    .scale({
      imperial: false,
      metric: true,
    })
    .addTo(map);

  loadTrajectory();
});

watch(
  () => props.playingTS,
  () => {
    refreshMap();
  },
);

watch(
  () => props.trajectoryData,
  () => {
    loadTrajectory();
  },
);

function loadTrajectory() {
  if (map === undefined || props.trajectoryData.points.length === 0) return;
  const points = props.trajectoryData.points;

  // Create a marker and add it to the map
  if (marker === undefined) {
    marker = L.marker([0, 0]).addTo(map);
  }

  // Create a polyline and add it to the map
  const polyline = L.polyline([], {
    color: "lightblue",
    opacity: 0.8,
  }).addTo(map);
  // const traveledPath = L.polyline([], { color: "blue" }).addTo(map);

  // Add all points to the polyline
  points.forEach((point) => {
    polyline.addLatLng([point.lat, point.lng]);
  });
  // Fit the map view to the polyline
  map.fitBounds(polyline.getBounds());
  refreshMap();
}

let trajectoryPolyline: L.Polyline | undefined;
let previousIndex = 0;

function refreshMap() {
  if (map === undefined || props.trajectoryData.points.length === 0) return;

  const points = props.trajectoryData.points;
  const currentIndex = (() => {
    let idx = points.findIndex((point) => point.time >= props.playingTS);
    if (idx === -1) {
      idx = points.length - 1;
    }
    return idx;
  })();

  if (trajectoryPolyline === undefined) {
    // first time
    trajectoryPolyline = L.polyline([], { color: "blue", opacity: 0.8 }).addTo(
      map,
    );
    points.slice(0, currentIndex + 1).forEach((point) => {
      trajectoryPolyline?.addLatLng([point.lat, point.lng]);
    });
  } else {
    // update
    if (previousIndex <= currentIndex) {
      points.slice(previousIndex, currentIndex + 1).forEach((point) => {
        trajectoryPolyline?.addLatLng([point.lat, point.lng]);
      });
    } else {
      map?.removeLayer(trajectoryPolyline);
      trajectoryPolyline = undefined;
      refreshMap();
    }
  }

  const point = points[currentIndex];
  marker?.setLatLng([point.lat, point.lng]);

  currentElevation.value = point.ele;
  currentSpeed.value = point.spd;

  previousIndex = currentIndex;
}
</script>

<template>
  <div class="wrapper">
    <div id="viewer_map" />
    <div
      v-if="currentSpeed !== undefined && currentElevation !== undefined"
      class="map_info"
    >
      <div style="text-align: left">
        <date-time-label :timestamp="props.playingTS" />
      </div>
      <div style="display: flex">
        <div style="width: 100%; margin-right: 15px">
          <div class="dt">Speed:</div>
          <div class="dd">{{ Math.round(currentSpeed) }} km/h</div>
        </div>
        <div style="width: 100%">
          <div class="dt">Elevation:</div>
          <div class="dd">{{ Math.round(currentElevation) }} m</div>
        </div>
      </div>
    </div>

    <!-- <div class="overlay"></div> -->
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
#viewer_map {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 0;
}
.map_info {
  font-family: Menlo, Monaco, "Courier New", monospace;
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 1;
  background-color: white;
  color: gray;
  opacity: 0.8;
  border-radius: 10px;
  padding: 0 10px;
  width: 250px;
}
.map_info .dt {
  font-size: 15px;
  text-align: left;
}
.map_info .dd {
  font-size: 20px;
  text-align: right;
}
/* .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  z-index: 2;
} */
</style>
