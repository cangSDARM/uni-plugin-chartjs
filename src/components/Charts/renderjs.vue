<script lang="js">
export default {
  props: {
    labels: {
      type: Array,
      default: [],
    },
    datasets: {
      type: Array,
      default: [],
    },
    limit: {
      type: Number,
      default: 7200,
    },
    crosshairGroup: String,
    showCrosshair: Boolean,
    annotations: {
      type: Array,
      default: [],
    },
    title: String,
  },
  emits: ['update:crosshair'],
  expose: ['pushLinesDataToChart'],
  data() {
    return {
      zoomOrPaned: false,
      pushLinesDataBuffer: {},
      legends: [],
      legendClicked: -1,
      crosshairPos: { x: -1, y: -1 },
    };
  },
  computed: {
    // it's not changeable
    domId() {
      if (!globalThis.chartId || typeof globalThis.chartId !== 'number') {
        globalThis.chartId = 0;
      }

      globalThis.chartId++;
      return `chart-${globalThis.chartId}`;
    },
    propsProxy() {
      return this.$props;
    },
  },
  methods: {
    pushLinesDataToChart(arr, opt) {
      this.pushLinesDataBuffer = { arr, opt };
    },
    handleZoom(zoom) {
      this.zoomOrPaned = zoom;
    },
    generateLegends(legends) {
      this.legends = legends;
    },
    clickLegend(i) {
      this.legendClicked = i;
      this.$nextTick(() => {
        // reset clicked
        this.legendClicked = -1;
      });
    },
    onClickInCanvas(pos) {
      this.crosshairPos = pos;
    },
  },
};
</script>

<script module="chartProxy" lang="renderjs">
export { default } from './ChartProxy';
</script>

<template>
  <!-- ⚠️renderjs里只能用vue2的方法，并且逻辑和vue2是一致的（包括bug） -->
  <!-- #ifdef APP-PLUS || H5 -->
  <view class="relative">
    <view
      :id="domId"
      class="h-full"
      :change:id="chartProxy.initDomNode"
      :props-proxy="propsProxy"
      :change:props-proxy="chartProxy.initInstance"
      :push-lines-data-buffer="pushLinesDataBuffer"
      :change:push-lines-data-buffer="chartProxy.pushLinesData"
      :legend-clicked="legendClicked"
      :change:legend-clicked="chartProxy.toggleDataVisibility"
    >
      <slot :legends="legends" :toggle-data-visibility="clickLegend" />
      <slot name="crosshair" :pos="crosshairPos">
        <view
          v-if="crosshairPos.x > 0"
          class="cross-hair absolute w-1px"
          :style="{ left: `${crosshairPos.x}px` }"
        />
      </slot>
    </view>
    <button
      v-if="zoomOrPaned"
      class="reset-zoom absolute right-0 top-0"
      title="reset zoom"
      @click="
        chartProxy.zoom(false);
        zoomOrPaned = false;
      "
    >
      R
    </button>
  </view>
  <!-- #endif -->
  <!-- #ifndef APP-PLUS || H5 -->
  <view>非 APP、H5 环境不支持</view>
  <!-- #endif -->
</template>
