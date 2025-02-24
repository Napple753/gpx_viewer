<script setup lang="ts">
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { onMounted, watch } from "vue";

const props = defineProps<{
  playing_ts: number;
  trajectory_data: {
    points: {
      lat: number;
      lng: number;
      time: string;
      ele: number;
      spd: number;
    }[];
  };
}>();

let marker: L.Marker | undefined;
let map: L.Map | undefined;

onMounted(() => {
  // Initialize the map
  map = L.map("map").setView([0, 0], 2);
  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  loadTrajectory();
});

watch(
  () => props.playing_ts,
  () => {
    refreshMap();
  }
);

watch(
  () => props.trajectory_data,
  () => {
    loadTrajectory();
  }
);

function loadTrajectory() {
  if (map === undefined || props.trajectory_data.points.length === 0) return;
  const points = props.trajectory_data.points;

  // Create a marker and add it to the map
  if (marker === undefined) {
    marker = L.marker([0, 0]).addTo(map);
  }

  // Create a polyline and add it to the map
  const polyline = L.polyline([], {
    color: "lightblue",
    opacity: 0.5,
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
  if (map === undefined || props.trajectory_data.points.length === 0) return;

  const points = props.trajectory_data.points;
  const currentIndex = (() => {
    let idx = points.findIndex(
      (point) => new Date(point.time).getTime() >= props.playing_ts
    );
    if (idx === -1) {
      idx = points.length - 1;
    }
    return idx;
  })();

  if (trajectoryPolyline === undefined) {
    // first time
    trajectoryPolyline = L.polyline([], { color: "blue" }).addTo(map);
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
  console.log(point.spd);

  previousIndex = currentIndex;
}
</script>

<template>
  <div id="viewer_map"></div>
</template>

<style scoped></style>
