<script setup>
const props = defineProps({
  legends: Array,
});
const emits = defineEmits(['click']);
</script>

<template>
  <view class="absolute right-0 top-10px flex flex-row flex-items-center">
    <button
      v-for="legend in legends"
      :key="legend.text"
      class="flex flex-row flex-items-center"
      @click="emits('click', legend.datasetIndex)"
    >
      <view class="h-3 w-3 rounded-1/1" :style="{ background: legend.strokeStyle }" />
      <text class="ml-1 font-size-4 color-#86888F font-bold">
        {{ legend.text }}
      </text>
    </button>
  </view>
</template>
