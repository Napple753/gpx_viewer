<script setup lang="ts">
import TimeDurationLabel from "./TimeDurationLabel.vue";
const playing_ts = defineModel<number>("playing_ts");
const play_speed = defineModel<number>("play_speed");

defineProps<{
  minTS: number;
  maxTS: number;
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
        v-model="playing_ts"
        class="seekBar"
        type="range"
        :min="minTS"
        :max="maxTS"
      >
      <div class="remainingTime">
        <time-duration-label :duration="maxTS - (playing_ts || 0)" />
      </div>
    </div>
    <div
      class="controlsWrapper"
      @keydown.prevent
    >
      <div>
        <button @click="emit('togglePlaying')">
          {{ playing ? "Pause" : "Play" }}
        </button>
      </div>
      <div>
        <select v-model="play_speed">
          <option
            v-for="item in playSpeedOptions"
            :key="item.number"
            :value="item.number"
          >
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
