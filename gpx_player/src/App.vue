<script setup lang="ts">
import { ref, watch } from "vue";
import SeekBar from "./components/SeekBar.vue";
import TrajectoryViewer from "./components/TrajectoryViewer.vue";

const playing_ts = ref(0);
const min_ts = ref(0);
const max_ts = ref(0);

const trajectory_data = ref({
  points: [],
});

// Load the points data
fetch("/points_data.json")
  .then((response) => response.json())
  .then((data) => {
    trajectory_data.value = data;

    // // Set the min and max values for the time slider
    playing_ts.value = new Date(data.points[0].time).getTime();
    min_ts.value = new Date(data.points[0].time).getTime();
    max_ts.value = new Date(data.points.at(-1).time).getTime();
  });

watch(
  () => playing_ts,
  () => {
    console.log(playing_ts.value);
  }
);
</script>

<template>
  <div id="map">
    <trajectory-viewer
      :playing_ts="playing_ts"
      :trajectory_data="trajectory_data"
    />
  </div>
  <div id="control">
    <seek-bar v-model="playing_ts" :min_ts="min_ts" :max_ts="max_ts" />
  </div>
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
/* body {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
} */
#map {
  width: 100%;
  height: 80vh;
}
</style>
