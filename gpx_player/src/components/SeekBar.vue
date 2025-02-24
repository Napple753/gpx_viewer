<script setup lang="ts">
import { ref } from "vue";
import DateTimeLabel from "./DateTimeLabel.vue";
import TimeDurationLabel from "./TimeDurationLabel.vue";
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
    let new_val = model.value + 100 * playSpeed.value;
    if (new_val > props.max_ts) {
      new_val = props.max_ts;
      playing.value = false;
    }
    model.value = new_val;
  }
}, 100);
</script>

<template>
  <div class="wrapper">
    <div class="seekBarWrapper">
      <input
        class="seekBar"
        type="range"
        v-model.number="model"
        :min="min_ts"
        :max="max_ts"
      />
      <time-duration-label
        class="remainingTime"
        :duration="max_ts - (model || 0)"
      ></time-duration-label>
    </div>
    <div class="controlsWrapper">
      <div>
        <button @click="playing = !playing">
          {{ playing ? "Pause" : "Play" }}
        </button>
      </div>
      <div>
        <select v-model="playSpeed">
          <option v-for="item in playSpeedOptions" v-bind:value="item.number">
            {{ item.title }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  height: 60px;
}
.seekBarWrapper {
  box-sizing: border-box;
  width: 100%;
  height: 20px;
  padding: 0 10px;
  display: flex;
}
.seekBar {
  width: 100%;
}
.remainingTime {
  width: 120px;
}
.controlsWrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px;
}
</style>
