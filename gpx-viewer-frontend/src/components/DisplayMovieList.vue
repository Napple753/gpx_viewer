<script setup lang="ts">
import type { MovieData } from "@/types";

const props = defineProps<{
  movieList: MovieData[];
  isPlaying: boolean;
  playingTS: number;
  playingSpeed: number;
}>();
</script>

<template>
  <display-movie
    v-for="movie in props.movieList"
    :key="movie.fileName"
    :movie-data="movie"
    :is-playing="props.isPlaying"
    :playing-t-s="props.playingTS"
    :playing-speed="props.playingSpeed"
  />
</template>

<style scoped></style>
