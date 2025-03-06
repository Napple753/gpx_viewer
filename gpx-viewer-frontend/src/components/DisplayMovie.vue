<script setup lang="ts">
import type { MovieData } from "@/types";
import { defineProps, ref, computed, watch } from "vue";

const props = defineProps<{
  movieData: MovieData;
  isPlaying: boolean;
  playingTS: number;
  playingSpeed: number;
}>();

const playbackRateMin = 0;
const playbackRateMax = 5;

const video = ref<HTMLVideoElement | null>(null);

const startTime = computed(() => {
  return props.movieData.startTime || 0;
});
const endTime = computed(() => {
  return props.movieData.startTime + props.movieData.movieLength || 0;
});

const currentTime = computed(() => {
  return (
    Math.min(
      props.movieData.movieLength,
      Math.max(0, props.playingTS - props.movieData.startTime),
    ) / 1000
  );
});

const isPlaying = computed(() => {
  return (
    video.value &&
    props.isPlaying &&
    isMovieTime.value &&
    props.playingSpeed < playbackRateMax
  );
});

watch(
  () => isPlaying.value,
  // () => props.isPlaying,
  (newVal, oldVal) => {
    if (newVal && !oldVal) {
      console.log("play");
      video.value?.play();
    } else {
      console.log("stop");
      video.value?.pause();
    }
  },
);

const isMovieTime = computed(() => {
  return startTime.value <= props.playingTS && props.playingTS <= endTime.value;
});

const playbackRate = computed(() => {
  return Math.max(
    Math.min(props.playingSpeed, playbackRateMax),
    playbackRateMin,
  );
});
</script>

<template>
  <video
    v-show="isMovieTime"
    ref="video"
    :src="`/gpx_viewer/movies/${props.movieData.fileName}`"
    :currentTime="currentTime"
    :playbackRate="playbackRate"
    muted
  />
</template>

<style scoped>
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
