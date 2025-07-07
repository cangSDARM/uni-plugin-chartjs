const OUTRANGED_CROSSHAIR_POS = { x: -1, y: -1 };

export const CrosshairGroupPlugin = {
  id: 'crosshairGroup',
  timeout: -1,
  crosshairGroup: new Map(),
  cachedOptions: {
    enabled: false,
    __followPoint: undefined,
    getInstances: () => {},
    group: '',
    domId: '',
    timeout: 1500,
    onPosUpdate: () => {},
  },
  afterInit(_chart, _args, options) {
    const mergedOptions = Object.assign(this.cachedOptions, options);

    const { group, domId } = mergedOptions;
    if (group) {
      const groupItems = this.crosshairGroup.get(group);
      if (Array.isArray(groupItems)) {
        this.crosshairGroup.set(group, groupItems.concat([domId]));
      }
      else {
        this.crosshairGroup.set(group, [domId]);
      }
    }
  },
  beforeEvent(_chart, { event }, options) {
    const mergedOptions = Object.assign(this.cachedOptions, options);
    switch (event.type) {
      case 'click':
        this.triggerCrosshairGroup(event, mergedOptions);
        break;
      //   case 'mouseout': {
      //     const mergedOptions = Object.assign(this.cachedOptions, options);
      //     this.clearCrosshairGroup(mergedOptions);
      //     break;
      //   }
    }
  },
  clearCrosshairGroup(options) {
    const groupItems = this.crosshairGroup.get(options.group);
    const chartInstances = options.getInstances();
    groupItems?.forEach((domId) => {
      const instance = chartInstances.get(domId);
      if (!instance)
        return;

      const tooltip = instance.tooltip;
      tooltip.setActiveElements([], { x: 0, y: 0 });

      this.setFollowPoint(instance, undefined);
      this.triggerUpdate(instance, OUTRANGED_CROSSHAIR_POS);
    });
  },
  triggerCrosshairGroup(evt, options) {
    clearTimeout(this.timeout);

    const group = options.group;
    const chartInstances = options.getInstances();
    let pos = {};
    const groupItems = this.crosshairGroup.get(group);
    groupItems?.forEach((domId, i) => {
      const instance = chartInstances.get(domId);
      if (!instance)
        return;

      const point = instance?.getElementsAtEventForMode(
        evt,
        'nearest',
        {
          intersect: false,
          axis: 'x',
        },
        false,
      )?.[0];

      if (!point)
        return;

      pos = { x: point.element.x };

      const tooltip = instance.tooltip;
      tooltip.setActiveElements(
        Array.from({ length: instance.data.datasets.length }).map((_, i) => ({
          datasetIndex: i,
          index: point.index,
        })),
      );

      this.setFollowPoint(instance, point);
      this.triggerUpdate(instance, pos);
    });

    this.timeout = setTimeout(() => {
      this.clearCrosshairGroup(options);
    }, options.timeout);
  },
  triggerUpdate(chart, pos) {
    chart.options.plugins?.crosshairGroup?.onPosUpdate?.(pos);
  },
  setFollowPoint(_chart, point) {
    Object.assign(this.cachedOptions, { __followPoint: point });
  },
  afterDraw(chart, _args, options) {
    const mergedOptions = Object.assign(this.cachedOptions, options);
    const { __followPoint } = mergedOptions;
    if (!__followPoint) {
      return;
    }

    const { dataIndex, index, datasetIndex } = __followPoint;
    const meta = chart.getDatasetMeta(datasetIndex);
    const dataPoint = meta.data[index ?? dataIndex];

    const x = dataPoint.getCenterPoint().x;

    this.triggerUpdate(chart, { x });
  },
  afterDestroy() {
    this.setFollowPoint({}, undefined);
  },
};
