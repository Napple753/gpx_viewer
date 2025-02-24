<script setup lang="ts">
import { ref, watch } from "vue";
import SeekBar from "./components/SeekBar.vue";
import TrajectoryViewer from "./components/TrajectoryViewer.vue";
import { gpx2jsobj } from "./gpx2jsobj";

const playing_ts = ref(0);
const min_ts = ref(0);
const max_ts = ref(0);

const trajectory_data = ref({
  points: [],
});

// Load the points data
fetch("/points_data.gpx")
  .then((response) => response.text())
  .then((xmlText) => {
    const data = gpx2jsobj(xmlText);
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
  <div class="map_wrapper">
    <div id="map">
      <trajectory-viewer
        :playing_ts="playing_ts"
        :trajectory_data="trajectory_data"
      />
    </div>
    <div id="control">
      <seek-bar v-model="playing_ts" :min_ts="min_ts" :max_ts="max_ts" />
    </div>
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
</style>
<style scoped>
.map_wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
#map {
  width: 100%;
  height: 100%;
}
</style>
