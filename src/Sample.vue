<script setup>
import ChartsLines from '@/components/Charts/renderjs.vue';
import {
  getChart2Datasets,
  getChart1Datasets,
  getChart3Datasets,
} from './constant';
import Legend from './Legend.vue';

const Chart1Labels = ['A', 'B', 'C', 'D', 'E', 'F'];

// template refs
const chart2Ref = ref();
const chart1Ref = ref();
const chart3Ref = ref();

let interval;
onMounted(() => {
  interval = setInterval(() => {
    chart2Ref.value?.pushLinesDataToChart({
      time: Date.now().valueOf(),
      data: [Math.random() * 10],
    });
    chart1Ref.value?.pushLinesDataToChart({
      time: Date.now().valueOf(),
      data: [
        Math.random() * 10,
        Math.random() * 10,
        Math.random() * 10,
        Math.random() * 10,
        Math.random() * 10,
        Math.random() * 10,
      ],
    });
    chart3Ref.value?.pushLinesDataToChart({
      time: Date.now().valueOf(),
      data: [Math.random() * 10],
    });
  }, 1000);
});
onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<template>
  <view class="cross-haired relative h-0 flex flex-col justify-center flex-items-stretch">
    <ChartsLines
      ref="chart1Ref"
      class="combined-chart h-1/3"
      :limit="60 * 60 * 2"
      :datasets="getChart1Datasets(Chart1Labels)"
      title="Chart1"
      crosshair-group="hair-group1"
      show-crosshair
    >
      <template #default="{ legends, toggleDataVisibility }">
        <Legend :legends="legends" @click="toggleDataVisibility" />
      </template>
      <template #crosshair="{ pos }">
        <view v-if="pos.x > 0" class="crosshair" :style="{ left: `${pos?.x}px` }" />
      </template>
    </ChartsLines>
    <ChartsLines
      ref="chart2Ref"
      class="combined-chart h-1/3"
      crosshair-group="hair-group1"
      :limit="60 * 60 * 2"
      :datasets="getChart2Datasets('Chart2')"
      title="Chart2"
    >
      <template #default="{ legends, toggleDataVisibility }">
        <Legend :legends="legends" @click="toggleDataVisibility" />
      </template>
    </ChartsLines>
    <ChartsLines
      ref="chart3Ref"
      class="combined-chart h-1/3"
      :limit="60 * 60 * 2"
      :datasets="getChart3Datasets('Chart3')"
      crosshair-group="hair-group1"
      title="Chart3"
    >
      <template #default="{ legends, toggleDataVisibility }">
        <Legend :legends="legends" @click="toggleDataVisibility" />
      </template>
    </ChartsLines>
  </view>
</template>

<style lang="scss" scoped>
.cross-haired {
  .crosshair {
    position: absolute;
    width: 0;
    border-left: 2px dashed #333;
    top: 0;

    // based on charts height
    bottom: -300%;
  }
}
</style>
