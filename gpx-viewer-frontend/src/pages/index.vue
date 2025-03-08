<script setup lang="ts">
import { ref } from "vue";
import type { GPXPoint, MovieData } from "../types";
import { gpx2jsobj } from "../gpx2jsobj";
import GPXViewer from "../components/GPXViewer.vue";

const trajectory_data = ref<{ points: GPXPoint[] } | null>(null);
const movieList = ref<MovieData[] | null>([]);
// Load the points data
fetch(import.meta.env.BASE_URL + "/points_data.gpx")
  .then((response) => response.text())
  .then((xmlText) => {
    const tmp = gpx2jsobj(xmlText);

    tmp.points = tmp.points.filter(
      (point) =>
        new Date("2025-02-15T00:57:00Z").getTime() <= point.time &&
        point.time <= new Date("2025-02-15T16:37:00").getTime(),
    );

    trajectory_data.value = tmp;
  });

fetch(import.meta.env.BASE_URL + "/movie_info_list.json")
  .then((response) => response.json())
  .then((json) => {
    movieList.value = json;
  });
</script>

<template>
  <g-p-x-viewer
    v-if="trajectory_data && movieList"
    :trajectory-data="trajectory_data"
    :movie-list="movieList"
  />
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
