<script setup lang="ts">
import { ref } from "vue";
import DateTimeLabel from "./DateTimeLabel.vue";
const model = defineModel<number>();

const props = defineProps<{
  min_ts: number;
  max_ts: number;
}>();

const playSpeedOptions = [
  { title: "10x", number: 10 },
  { title: "100x", number: 100 },
  { title: "1000x", number: 1000 },
  { title: "10000x", number: 10000 },
];

const playSpeed = ref(100);

const playing = ref(false);

setInterval(() => {
  if (playing.value && model.value) {
    model.value += 100 * playSpeed.value;

    if (model.value > props.max_ts) {
      model.value = props.max_ts;
      playing.value = false;
    }
  }
}, 100);
</script>

<template>
  <div id="control">
    <button @click="playing = !playing">
      {{ playing ? "Pause" : "Play" }}
    </button>
    <input
      type="range"
      v-model.number="model"
      :min="min_ts"
      :max="max_ts"
      style="width: auto"
    />
    <select v-model="playSpeed">
      <option v-for="item in playSpeedOptions" v-bind:value="item.number">
        {{ item.title }}
      </option>
    </select>
    <div><date-time-label :timestamp="min_ts"></date-time-label></div>
    <div><date-time-label :timestamp="max_ts"></date-time-label></div>
    <div><date-time-label :timestamp="model"></date-time-label></div>
  </div>
</template>

<style scoped></style>
