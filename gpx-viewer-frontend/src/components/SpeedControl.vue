<script setup lang="ts">
const movie_speed = defineModel<number>("movie_speed");
const other_speed = defineModel<number>("other_speed");

const minSpeed = 1;
const maxSpeed = 1000;

const tickLabels: { [key: number]: string } = {};

new Array(Math.log10(maxSpeed) - Math.log10(minSpeed) + 1)
  .fill(0)
  .map((_, i) => minSpeed * 10 ** i)
  .forEach((val, i) => (tickLabels[i] = val + "x"));

const movieSliderPos = computed({
  get: () => (movie_speed.value ? Math.log10(movie_speed.value) : 2),
  set: (val: number) => (movie_speed.value = 10 ** val),
});
const otherSliderPos = computed({
  get: () => (other_speed.value ? Math.log10(other_speed.value) : 2),
  set: (val: number) => (other_speed.value = 10 ** val),
});
</script>

<template>
  <div style="width: 250px">
    video speed:
    <v-slider
      v-model="movieSliderPos"
      :min="Math.log10(minSpeed)"
      :max="Math.log10(maxSpeed)"
      step="0.25"
      :ticks="tickLabels"
      show-ticks="always"
    />
    other:
    <v-slider
      v-model="otherSliderPos"
      :min="Math.log10(minSpeed)"
      :max="Math.log10(maxSpeed)"
      step="0.25"
      :ticks="tickLabels"
      show-ticks="always"
    />
  </div>
</template>

<style scoped></style>
