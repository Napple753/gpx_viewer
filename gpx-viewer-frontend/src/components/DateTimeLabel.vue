<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  timestamp?: number;
}>();

const date = computed(() =>
  props.timestamp ? new Date(props.timestamp) : undefined,
);
</script>

<template>
  <span>{{
    date?.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) || ""
  }}</span>
</template>

<style scoped>
span {
  font-family: Menlo, Monaco, "Courier New", monospace;
}
</style>
