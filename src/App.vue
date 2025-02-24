<script setup lang="ts">
import { ref, watch } from "vue";
import type { Ref } from "vue";
import SeekBar from "./components/SeekBar.vue";
import TrajectoryViewer from "./components/TrajectoryViewer.vue";
import { gpx2jsobj } from "./gpx2jsobj";

const playing_ts = ref(0);
const min_ts = ref(0);
const max_ts = ref(0);
const seekBar: Ref<typeof SeekBar | null> = ref(null);

const trajectory_data: Ref<{
  points: {
    lat: number;
    lng: number;
    time: number;
    ele: number;
    spd: number;
  }[];
}> = ref({
  points: [],
});

// Load the points data
fetch("/points_data.gpx")
  .then((response) => response.text())
  .then((xmlText) => {
    trajectory_data.value = gpx2jsobj(xmlText);
    const points = trajectory_data.value.points;

    // // Set the min and max values for the time slider
    playing_ts.value = new Date(points[0].time).getTime();
    min_ts.value = new Date(points[0].time).getTime();
    max_ts.value = new Date(points[points.length - 1].time).getTime();
  });

watch(
  () => playing_ts,
  () => {
    console.log(playing_ts.value);
  }
);

function keyboardShortcut(e: KeyboardEvent) {
  if (e.key === " ") {
    seekBar.value?.togglePlaying();
  } else if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(parseInt(e.key))) {
    const ratio = parseInt(e.key);
    playing_ts.value =
      min_ts.value + (max_ts.value - min_ts.value) * (ratio / 10);
  } else if (e.key === "ArrowRight") {
    playing_ts.value += (max_ts.value - min_ts.value) / 100;
  } else if (e.key === "ArrowLeft") {
    playing_ts.value -= (max_ts.value - min_ts.value) / 100;
  }
}

window.addEventListener("keydown", keyboardShortcut);
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
      <seek-bar
        ref="seekBar"
        v-model="playing_ts"
        :min_ts="min_ts"
        :max_ts="max_ts"
      />
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
  height: 100vh;
  width: 100vw;
  /* overflow: hidden; */
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
  width: 100vw;
  height: 100%;
}
</style>
