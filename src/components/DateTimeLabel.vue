<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  timestamp?: number;
}>();

const date = computed(() =>
  props.timestamp ? new Date(props.timestamp) : undefined
);
</script>

<template>
  <span>{{ date?.getFullYear() || 0 }}</span>
  /
  <span>{{ date ? ("0" + (date.getMonth() + 1)).slice(-2) : "00" }}</span>
  /
  <span>{{ ("0" + (date?.getDate() || 0)).slice(-2) }}</span>
  &nbsp;
  <span style="min-width: 2.5ex">{{
    ("0" + (date?.getHours() || 0)).slice(-2)
  }}</span>
  :
  <span style="min-width: 2.5ex">{{
    ("0" + (date?.getMinutes() || 0)).slice(-2)
  }}</span>
  :
  <span style="min-width: 2.5ex">{{
    ("0" + (date?.getSeconds() || 0)).slice(-2)
  }}</span>
</template>

<style scoped>
span {
  display: inline-block;
  text-align: right;
}
</style>
