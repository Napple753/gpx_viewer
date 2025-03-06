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

// const movieList: MovieData[] = [
//   {
//     fileName: "VID_20250215_150007_00_143.mp4",
//     startTime: new Date("2025-02-15T06:00:48Z").getTime(), //timestamp
//     movieLength: (2 * 60 + 20) * 1000, //[ms]
//   },
//   {
//     fileName: "VID_20250215_150950_00_144.mp4",
//     startTime: new Date("2025-02-15T06:09:52Z").getTime(), //timestamp
//     movieLength:
//       new Date("2025-02-15T06:15:20Z").getTime() -
//       new Date("2025-02-15T06:09:52Z").getTime(), //[ms]
//   },
//   {
//     fileName: "VID_20250215_153501_00_145.mp4",
//     startTime: new Date("2025-02-15T06:35:01Z").getTime(), //timestamp
//     movieLength:
//       new Date("2025-02-15T06:41:36Z").getTime() -
//       new Date("2025-02-15T06:35:01Z").getTime(), //[ms]
//   },
//   {
//     fileName: "VID_20250215_155000_00_146.mp4",
//     startTime: new Date("2025-02-15T06:50:01Z").getTime(), //timestamp
//     movieLength:
//       new Date("2025-02-15T06:52:33Z").getTime() -
//       new Date("2025-02-15T06:50:01Z").getTime(), //[ms]
//   },
//   {
//     fileName: "VID_20250215_155903_00_147.mp4",
//     startTime: new Date("2025-02-15T06:59:03Z").getTime(), //timestamp
//     movieLength:
//       new Date("2025-02-15T07:01:51Z").getTime() -
//       new Date("2025-02-15T06:59:03Z").getTime(), //[ms]
//   },
//   {
//     fileName: "VID_20250215_160659_00_148.mp4",
//     startTime: new Date("2025-02-15T07:06:59Z").getTime(), //timestamp
//     movieLength:
//       new Date("2025-02-15T07:08:57Z").getTime() -
//       new Date("2025-02-15T07:06:59Z").getTime(), //[ms]
//   },

//   {
//     fileName: "VID_20250215_161025_00_149.mp4",
//     startTime: new Date("2025-02-15T07:10:24Z").getTime(), //timestamp
//     movieLength:
//       new Date("2025-02-15T07:13:42Z").getTime() -
//       new Date("2025-02-15T07:10:24Z").getTime(), //[ms]
//   },
//   {
//     fileName: "VID_20250215_162357_00_150.mp4",
//     startTime: new Date("2025-02-15T07:23:58Z").getTime(), //timestamp
//     movieLength:
//       new Date("2025-02-15T07:31:03Z").getTime() -
//       new Date("2025-02-15T07:23:58Z").getTime(), //[ms]
//   },
// ];
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
