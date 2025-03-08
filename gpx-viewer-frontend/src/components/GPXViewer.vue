<script setup lang="ts">
import { ref } from "vue";
import SeekBar from "./SeekBar.vue";
import TrajectoryViewer from "./TrajectoryViewer.vue";
import { TimelinePlayer } from "../timelinePlayer";
import type { GPXPoint, MovieData } from "../types";

const props = defineProps<{
  trajectoryData: { points: GPXPoint[] };
  movieList: MovieData[];
}>();

const points = props.trajectoryData.points;
const min_ts = points[0].time;
const max_ts = points[points.length - 1].time;

const playing_ts = ref(0);
const isPlaying = ref(false);

const movie_speed = ref(10);
const other_speed = ref(1000);
const play_speed = ref(1000);

const timelinePlayer = new TimelinePlayer({
  start_point: min_ts,
  end_point: max_ts,
  play_speed: play_speed.value,
});

function togglePlaying() {
  timelinePlayer.togglePlay();
}

function rewindPlayingTs() {
  timelinePlayer.jumpFromCurrentPoint(-0.01);
}
function fastForwardPlayingTs() {
  timelinePlayer.jumpFromCurrentPoint(0.01);
}

window.addEventListener("keydown", function (e: KeyboardEvent) {
  if (e.key === " ") {
    togglePlaying();
  } else if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(parseInt(e.key))) {
    const ratio = parseInt(e.key);
    timelinePlayer.jumpToPoint(ratio / 10);
  } else if (e.key === "ArrowRight") {
    fastForwardPlayingTs();
  } else if (e.key === "ArrowLeft") {
    rewindPlayingTs();
  }
});

setInterval(() => {
  playing_ts.value = timelinePlayer.getCurrentTs();
  isPlaying.value = timelinePlayer.isPlaying;

  if (isPlayMovie()) {
    timelinePlayer.playSpeed = movie_speed.value;
  } else {
    timelinePlayer.playSpeed = other_speed.value;
  }

  play_speed.value = timelinePlayer.playSpeed;
}, 100);

function updatePlayingTs(ts: number | undefined) {
  if (ts === undefined) return;
  timelinePlayer.setCurrentTs(Number(ts));
}

function isPlayMovie() {
  const playingTS = playing_ts.value;
  return props.movieList.some(
    (movie) =>
      movie.startTime <= playingTS &&
      playingTS <= movie.startTime + movie.movieLength,
  );
}

// function updatePlayingSpeed(speed: number | undefined) {
//   if (speed === undefined) return;
//   timelinePlayer.playSpeed = Number(speed);
// }

watch(
  () => movie_speed.value,
  (newVal) => {
    console.log("movie_speed", newVal);
  },
);
</script>

<template>
  <div class="map_wrapper">
    <div class="map_video_wrapper">
      <div id="map">
        <trajectory-viewer
          :playing-t-s="playing_ts"
          :trajectory-data="trajectoryData"
          :movie-list="movieList"
        />
      </div>
      <div class="video_wrapper">
        <display-movie-list
          :playing-speed="play_speed"
          :is-playing="isPlaying"
          :movie-list="movieList"
          :playing-t-s="playing_ts"
        />
      </div>
    </div>
    <div id="control">
      <seek-bar
        v-model:movie_speed="movie_speed"
        v-model:other_speed="other_speed"
        :playing_ts="playing_ts"
        :min-t-s="min_ts"
        :max-t-s="max_ts"
        :playing="isPlaying"
        @update:playing_ts="updatePlayingTs"
        @toggle-playing="togglePlaying"
        @rewind-playing-ts="rewindPlayingTs"
        @fast-forward-playing-ts="fastForwardPlayingTs"
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
.map_video_wrapper {
  display: flex;
  width: 100%;
  height: calc(100vh - 78px);
}
#map,
.video_wrapper {
  width: 100%;
  height: 100%;
}
</style>
