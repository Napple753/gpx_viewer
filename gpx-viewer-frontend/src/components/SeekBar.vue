<script setup lang="ts">
import type { GPXPoint } from "@/types";
import { point } from "leaflet";
const playing_ts = defineModel<number>("playing_ts");

const props = defineProps<{
  minTS: number;
  maxTS: number;
  highlitedPoints: GPXPoint[];
}>();

const sliderWidth = ref("100%");

function fitWidth() {
  const vInput = document.querySelector(".v-input__control");
  if (vInput) {
    sliderWidth.value = vInput.clientWidth + "px";
  }
}
onMounted(() => {
  fitWidth();
});
window.addEventListener("resize", () => {
  fitWidth();
});

const highlitedPointStyles = computed(() => {
  return (
    props.highlitedPoints?.map((point) => {
      return {
        left:
          ((point.time - props.minTS) / (props.maxTS - props.minTS)) * 100 +
          "%",
      };
    }) || []
  );
});
</script>

<template>
  <div class="seekBarWrapper">
    <div class="seekBar">
      <v-slider v-model="playing_ts" :min="minTS" :max="maxTS" />
    </div>
    <div class="annotationsWrapper">
      <div class="annotations" :style="{ width: sliderWidth }">
        <div
          v-for="pointStyle in highlitedPointStyles"
          :key="pointStyle.left"
          :style="pointStyle"
          class="highlitedPoint"
        ></div>
      </div>
    </div>
    <div class="graphsWrapper">
      <div class="graphs" :style="{ width: sliderWidth }"></div>
    </div>
  </div>
</template>

<style scoped>
.seekBarWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;

  width: 100%;
  height: 32px;
}
.seekBar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 100;
}
.annotationsWrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 90;
}
.annotations {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0 auto;
  position: relative;
}
.highlitedPoint {
  --size: 15px;
  position: absolute;
  top: 50%;
  height: var(--size);
  width: var(--size);
  box-sizing: border-box;
  border-radius: 50%;
  margin-top: calc(var(--size) / -2);
  margin-left: calc(var(--size) / -2);
  background-color: red;
}
.graphsWrapper {
  position: absolute;
  bottom: 100%;
  left: 0;
  opacity: 0.5;
  pointer-events: none;
  width: 100%;
  height: 10px;
  z-index: 95;
}
.graphs {
  background-color: green;
  height: 100%;
  margin: 0 auto;
}
</style>
