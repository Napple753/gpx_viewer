<script setup lang="ts">
import TimeDurationLabel from "./TimeDurationLabel.vue";
import SpeedControl from "./SpeedControl.vue";
const playing_ts = defineModel<number>("playing_ts");
const movie_speed = defineModel<number>("movie_speed");
const other_speed = defineModel<number>("other_speed");

defineProps<{
  minTS: number;
  maxTS: number;
  playing: boolean;
  highlitedPoints: GPXPoint[];
}>();

const emit = defineEmits([
  "togglePlaying",
  "rewindPlayingTs",
  "fastForwardPlayingTs",
  "setMovieSpeed",
  "setOtherSpeed",
]);

const showSpeedControl = ref(false);
</script>

<template>
  <div class="wrapper">
    <div class="seekBarWrapper">
      <seek-bar
        v-model:playing_ts="playing_ts"
        :min-t-s="minTS"
        :max-t-s="maxTS"
        :highlited-points="highlitedPoints"
      />
      <div class="remainingTime">
        <time-duration-label :duration="maxTS - (playing_ts || 0)" />
      </div>
    </div>
    <div class="controlsWrapper">
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
          <speed-control
            v-model:movie_speed="movie_speed"
            v-model:other_speed="other_speed"
          />
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
  height: 90px;
  width: 100%;
  user-select: none;
  position: relative;
}
.seekBarWrapper {
  box-sizing: border-box;
  width: 100%;
  height: 36px;
  padding: 0 10px;
  display: flex;
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
