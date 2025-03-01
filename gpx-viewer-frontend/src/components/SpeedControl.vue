<script setup lang="ts">
const model = defineModel<number>();

const minSpeed = 1;
const maxSpeed = 1000;

const tickLabels: { [key: number]: string } = {};

new Array(Math.log10(maxSpeed) - Math.log10(minSpeed) + 1)
  .fill(0)
  .map((_, i) => minSpeed * 10 ** i)
  .forEach((val, i) => (tickLabels[i] = val + "x"));

const sliderPos = computed({
  get: () => (model.value ? Math.log10(model.value) : 2),
  set: (val: number) => (model.value = 10 ** val),
});
</script>

<template>
  <div style="width: 250px">
    <v-slider
      v-model="sliderPos"
      :min="Math.log10(minSpeed)"
      :max="Math.log10(maxSpeed)"
      step="0.2"
      :ticks="tickLabels"
      show-ticks="always"
    />
  </div>
</template>

<style scoped></style>
