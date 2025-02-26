<script setup lang="ts">
import { ref } from "vue";
import { GPXPoint } from "./types";
import { gpx2jsobj } from "./gpx2jsobj";
import GPXViewer from "./components/GPXViewer.vue";

const trajectory_data = ref<{ points: GPXPoint[] } | null>(null);
// Load the points data
fetch("/points_data.gpx")
  .then((response) => response.text())
  .then((xmlText) => {
    trajectory_data.value = gpx2jsobj(xmlText);
  });
</script>

<template>
  <g-p-x-viewer v-if="trajectory_data" :trajectory_data="trajectory_data" />
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 100vh;
  width: 100vw;
  /* overflow: hidden; */
}
</style>
