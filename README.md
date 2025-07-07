# uni-plugin-chartjs (Sample)

a uniapp plugin for chart.js

## Get Started

1. clone/download this repo.
2. install deps:
   1. `chart.js^4.4`
   2. `chartjs-plugin-zoom^2.2`
   3. `chartjs-scale-timestack^1.0`
3. move the src folder to your uniapp project.
4. open `Sample.vue` to view use cases.

## Develop

- 修改 Chart 的类型(bar/radar/pie)，功能等：<br/>
  Modify the Chart type, functionality, etc:
  - see `@components/Charts/ChartProxy.js`
  - Refer to uniapp's RenderJS and native Chart.js plugin development<br/>
    参考 uniapp 的 RenderJS 或者是 Chart.js 插件开发
- 修改 Chart 和 Vue，Uni 表现层的交互等：<br/>
  Modify the Chart interaction between Vue, Uni, etc:
  - see `@components/Charts/renderjs.vue`
  - Refer to uniapp's RenderJS / Vue2 development<br/>
    参考 uniapp 的 RenderJS 或者是 Vue2 开发
