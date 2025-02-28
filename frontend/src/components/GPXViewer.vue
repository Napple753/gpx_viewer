<script setup lang="ts">
import { ref } from "vue";
import SeekBar from "./SeekBar.vue";
import TrajectoryViewer from "./TrajectoryViewer.vue";
import { TimelinePlayer } from "../timelinePlayer";
import type { GPXPoint } from "../types";

const props = defineProps<{
  trajectory_data: { points: GPXPoint[] };
}>();

const points = props.trajectory_data.points;
const min_ts = points[0].time;
const max_ts = points[points.length - 1].time;

const playing_ts = ref(0);
const isPlaying = ref(false);
const play_speed = ref(100);

const timelinePlayer = new TimelinePlayer({
  start_point: min_ts,
  end_point: max_ts,
  play_speed: play_speed.value,
});

function togglePlaying() {
  timelinePlayer.togglePlay();
}

window.addEventListener("keydown", function (e: KeyboardEvent) {
  if (e.key === " ") {
    togglePlaying();
  } else if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(parseInt(e.key))) {
    const ratio = parseInt(e.key);
    timelinePlayer.jumpToPoint(ratio / 10);
  } else if (e.key === "ArrowRight") {
    timelinePlayer.jumpFromCurrentPoint(0.01);
  } else if (e.key === "ArrowLeft") {
    timelinePlayer.jumpFromCurrentPoint(-0.01);
  }
});

setInterval(() => {
  playing_ts.value = timelinePlayer.getCurrentTs();
  isPlaying.value = timelinePlayer.isPlaying;
  play_speed.value = timelinePlayer.playSpeed;
}, 100);

function updatePlayingTs(ts: number | undefined) {
  if (ts === undefined) return;
  timelinePlayer.setCurrentTs(Number(ts));
}
function updatePlayingSpeed(speed: number | undefined) {
  if (speed === undefined) return;
  timelinePlayer.playSpeed = Number(speed);
}
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
        :playing_ts="playing_ts"
        @update:playing_ts="updatePlayingTs"
        :play_speed="play_speed"
        @update:play_speed="updatePlayingSpeed"
        :min_ts="min_ts"
        :max_ts="max_ts"
        :playing="isPlaying"
        @togglePlaying="togglePlaying"
      />
    </div>
  </div>
</template>

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
