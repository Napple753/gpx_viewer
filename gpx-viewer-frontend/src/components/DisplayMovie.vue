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

const videoCurrentTime = ref(0);

watch(
  () => currentTime.value,
  (newVal) => {
    if (Math.abs(videoCurrentTime.value - newVal) > 1.2) {
      videoCurrentTime.value = newVal;
    }
  },
);

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
  (newVal, oldVal) => {
    if (newVal && !oldVal) {
      video.value?.play();
    } else {
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

const isMuted = computed(() => {
  //return props.playingSpeed > playbackRateMax;
  return true;
});
</script>

<template>
  <video
    v-show="isMovieTime"
    ref="video"
    :src="props.movieData.fileURL"
    :currentTime="videoCurrentTime"
    :playbackRate="playbackRate"
    :muted="isMuted"
    preload="auto"
  />
</template>

<style scoped>
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
