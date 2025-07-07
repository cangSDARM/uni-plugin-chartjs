import Chart from 'chart.js/auto';
// import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { CrosshairGroupPlugin } from './CrosshairGroupPlugin';
import { UniappLegendPlugin } from './LegendPlugin';
import { limitPointDrawing } from './utils';
import 'chartjs-scale-timestack';

Chart.register(zoomPlugin);
// Chart.register(annotationPlugin);

const limitIfTooManyPoints = limitPointDrawing();

// renderjs bug, 如果放在vue里，会造成循环引用
const chartInstances = new Map();

const ChartProxy = {
  data() {
    return {
      domId: '',
    };
  },
  beforeUnmount() {
    this.destroyInstance();
  },
  methods: {
    initDomNode(domId, _, _owner, { $el }) {
      this.domId = domId;
      const wrapperElement = $el;
      const canvas = document.createElement('canvas');

      if (!wrapperElement)
        throw new Error('cannot access the chart element');
      wrapperElement.appendChild(canvas);
    },
    destroyInstance() {
      const domId = this.domId;
      chartInstances.get(domId)?.destroy();
      chartInstances.delete(domId);
      console.log('chart', domId, 'has been removed');
    },
    initInstance(props, _, owner, { $el }) {
      const canvas = $el?.querySelector('canvas');

      if (!canvas || !(canvas instanceof HTMLCanvasElement))
        throw new Error('cannot found any canvas to mount a chart');

      const instance = new Chart(canvas, {
        type: 'line',
        data: {
          labels: props.labels,
          datasets: props.datasets,
        },
        plugins: [UniappLegendPlugin, CrosshairGroupPlugin],
        options: {
          parsing: false,
          interaction: {
            intersect: false,
            axis: 'x',
            mode: 'nearest',
          },
          decimation: {
            enabled: true,
            algorithm: 'min-max',
          },
          responsive: true, // 确保图表是响应式的
          maintainAspectRatio: false, // 允许图表填充父容器的大小，而不必保持固定的宽高比
          scales: {
            y: {
              ticks: {
                precision: 2,
                // callback: (val) => (typeof val === 'number' ? formatter.format(val) : val),
                // see: https://github.com/chartjs/chartjs-plugin-zoom/issues/220
                callback(value) {
                  if (Math.floor(value) === value) {
                    return value;
                  }
                },
                minRotation: 0, // perf required
                maxRotation: 0, // perf required
              },
            },
            x: {
              type: 'timestack',
              ticks: {
                source: 'auto',
                // Disabled rotation for performance
                maxRotation: 0,
                autoSkip: true,
              },
            },
          },
          plugins: {
            title: {
              display: !!props.title,
              align: 'start',
              text: props.title,
              font: {
                weight: 'bold',
                size: 18,
              },
            },
            decimation: {
              enabled: true,
              algorithm: 'lttb',
            },
            crosshairGroup: {
              group: props.crosshairGroup,
              domId: this.domId,
              onPosUpdate: (pos) => {
                this.$ownerInstance.callMethod('onClickInCanvas', pos);
              },
              getInstances: () => chartInstances,
            },
            legend: {
              display: false,
            },
            uniappLegend: {
              update: (legends) => {
                owner?.callMethod('generateLegends', legends);
              },
            },
            zoom: {
              limits: { y: { min: 0 } },
              // 平移
              pan: {
                enabled: true,
                mode: 'x',
                onPanStart: () => this.zoom(true),
              },
              // 放大缩小
              zoom: {
                mode: 'x',
                onZoomStart: () => this.zoom(true),
                // 桌面端
                wheel: {
                  enabled: true,
                },
                // 移动端
                pinch: {
                  enabled: true,
                },
              },
            },
          },
        },
      });
      chartInstances.set(this.domId, instance);
    },
    zoom(toggle) {
      const instance = chartInstances.get(this.domId);
      // disable animation when zooming or panning
      if (toggle) {
        instance.options.animation.duration = 0;
      }
      else {
        instance.options.animation.duration = 1000;
      }
      instance.update();

      if (!toggle) {
        instance.resetZoom();
      }

      this.$ownerInstance?.callMethod('handleZoom', toggle);
    },
    pushLinesData(buffer) {
      const { arr, opt } = buffer;
      const instance = chartInstances.get(this.domId);
      if (!instance || !arr)
        return;
      if (Number.isNaN(arr.time)) {
        throw new TypeError('x轴必须是number类型，无法设置未被外部parse的数据！');
      }
      if (!Array.isArray(arr.data) || arr.data.length <= 0)
        return;
      const data = instance.data;
      if (data.datasets.length > 0) {
        for (let index = 0; index < data.datasets.length; ++index) {
          data.datasets[index].data.push({ x: arr.time, y: arr.data[index] });
        }
      }
      if (!opt?.async) {
        instance.update();
      }
      limitIfTooManyPoints(instance);
    },
    toggleDataVisibility(datasetIndex) {
      if (datasetIndex < 0)
        return;

      const instance = chartInstances.get(this.domId);
      if (!instance)
        return;

      const { type } = instance.config;
      if (type === 'pie' || type === 'doughnut') {
        // Pie and doughnut charts only have a single dataset and visibility is per item
        instance.toggleDataVisibility(datasetIndex);
      }
      else {
        instance.setDatasetVisibility(datasetIndex, !instance.isDatasetVisible(datasetIndex));
      }
      instance.update();
    },
  },
};

export default ChartProxy;
