<script setup lang="ts">
import { watch, ref } from "vue";
import type { Ref } from "vue";
const props = defineProps<{
  duration?: number;
}>();

const hours: Ref<string> = ref("--");
const minutes: Ref<string> = ref("--");
const seconds: Ref<string> = ref("--");
const ms: Ref<String> = ref("--");

watch(
  () => props.duration,
  () => {
    if (props.duration === undefined) {
      hours.value = "--";
      minutes.value = "--";
      seconds.value = "--";
      ms.value = "--";
      return;
    }

    const h = Math.floor(props.duration / (60 * 60 * 1000));
    hours.value = ("00" + h).slice(-2);
    let remaining = props.duration % (60 * 60 * 1000);
    const m = Math.floor(remaining / (60 * 1000));
    minutes.value = ("00" + m).slice(-2);
    remaining = remaining % (60 * 1000);
    const s = Math.floor(remaining / 1000);
    seconds.value = ("00" + s).slice(-2);
    ms.value = ("00" + (remaining % 1000)).slice(-2);
  }
);
</script>

<template>
  <span>{{ hours }}:{{ minutes }}:{{ seconds }}.{{ ms }}</span>
</template>

<style scoped>
span {
  font-family: Menlo, Monaco, "Courier New", monospace;
}
</style>
