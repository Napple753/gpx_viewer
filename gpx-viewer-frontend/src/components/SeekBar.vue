<script setup lang="ts">
import TimeDurationLabel from "./TimeDurationLabel.vue";
import SpeedControl from "./SpeedControl.vue";
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

const emit = defineEmits([
  "togglePlaying",
  "rewindPlayingTs",
  "fastForwardPlayingTs",
]);

const showSpeedControl = ref(false);
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
      />
      <div class="remainingTime">
        <time-duration-label :duration="maxTS - (playing_ts || 0)" />
      </div>
    </div>
    <div class="controlsWrapper" @keydown.prevent>
      <div>
        <v-btn @click="emit('togglePlaying')" icon>
          <v-icon>{{ playing ? "mdi-pause" : "mdi-play" }}</v-icon>
        </v-btn>
        <v-btn @click="emit('rewindPlayingTs')" icon size="small">
          <v-icon>mdi-rewind</v-icon>
        </v-btn>
        <v-btn @click="emit('fastForwardPlayingTs')" icon size="small">
          <v-icon>mdi-fast-forward</v-icon>
        </v-btn>
      </div>
      <div>
        <v-btn @click="showSpeedControl = !showSpeedControl" icon>
          <v-icon>mdi-speedometer</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="speedControl" v-show="showSpeedControl">
      <v-card>
        <div style="padding: 5px 10px">
          <speed-control v-model="play_speed" />
        </div>
      </v-card>
    </div>
  </div>
  <div
    v-show="showSpeedControl"
    class="speedControlOverlay"
    @click="showSpeedControl = false"
  ></div>
</template>

<style scoped>
.wrapper {
  height: 78px;
  width: 100%;
  user-select: none;
  position: relative;
}
.seekBarWrapper {
  box-sizing: border-box;
  width: 100%;
  height: 24px;
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

.speedControl {
  position: absolute;
  bottom: calc(100% + 10px);
  right: 10px;
  z-index: 1000;
}

.speedControlOverlay {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100vw;
}
</style>
