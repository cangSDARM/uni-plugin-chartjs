export const UniappLegendPlugin = {
  id: 'uniappLegend',
  legendCache: '',
  afterDestroy() {
    this.legendCache = '';
  },
  beforeLayout(chart, _args, options) {
    // Reuse the built-in legendItems generator
    const items = chart.options.plugins.legend.labels.generateLabels(chart);

    const stringified = JSON.stringify(items);
    if (this.legendCache === stringified) {
      // 减少 vue 层被影响的几率
      return;
    }

    if (this.legendCache === '') {
      this.legendCache = stringified;
    }

    options.update(items);
  },
};
