const DisablePointDrawingThreshold = 10_000;

export function limitPointDrawing() {
  let pointRadiusDisabled = false;

  return (chart) => {
    if (!pointRadiusDisabled && chart.data.labels.length > DisablePointDrawingThreshold) {
      chart.options.datasets.line.pointRadius = 0;
      pointRadiusDisabled = true;
      console.log('too big!');
    }
  };
}

/** 限制chart的数据量 */
export function chartSizeLimit(data, limit) {
  const limitation = Math.max(data.length - limit, 0);

  return data.slice(limitation);
}
