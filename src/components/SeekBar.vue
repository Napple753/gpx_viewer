<script setup lang="ts">
import { ref } from "vue";
import TimeDurationLabel from "./TimeDurationLabel.vue";
const playing_ts = defineModel<number>("playing_ts");
const play_speed = defineModel<number>("play_speed");

const props = defineProps<{
  min_ts: number;
  max_ts: number;
  playing: boolean;
}>();

const playSpeedOptions = [
  { title: "10x", number: 10 },
  { title: "100x", number: 100 },
  { title: "1000x", number: 1000 },
  { title: "10000x", number: 10000 },
];

const emit = defineEmits(["togglePlaying"]);
</script>

<template>
  <div class="wrapper">
    <div class="seekBarWrapper">
      <input
        class="seekBar"
        type="range"
        v-model="playing_ts"
        :min="min_ts"
        :max="max_ts"
      />
      <div class="remainingTime">
        <time-duration-label :duration="max_ts - (playing_ts || 0)" />
      </div>
    </div>
    <div class="controlsWrapper" @keydown.prevent>
      <div>
        <button @click="emit('togglePlaying')">
          {{ playing ? "Pause" : "Play" }}
        </button>
      </div>
      <div>
        <select v-model="play_speed">
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
  width: 100vw;
  user-select: none;
  overflow: hidden;
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
.seekBar:focus-visible {
  outline: none;
}
.remainingTime {
  width: 100px;
  margin: 0;
  padding: 0;
  text-align: right;
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
