<script setup lang="ts">
import { ref } from "vue";
import type { GPXPoint } from "../types";
import { gpx2jsobj } from "../gpx2jsobj";
import GPXViewer from "../components/GPXViewer.vue";

const trajectory_data = ref<{ points: GPXPoint[] } | null>(null);
// Load the points data
fetch(import.meta.env.BASE_URL + "/points_data.gpx")
  .then((response) => response.text())
  .then((xmlText) => {
    trajectory_data.value = gpx2jsobj(xmlText);
  });
</script>

<template>
  <g-p-x-viewer v-if="trajectory_data" :trajectory-data="trajectory_data" />
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 100vh;
  height: 100dvh;
  width: 100%;
  overflow: hidden;
}
</style>
