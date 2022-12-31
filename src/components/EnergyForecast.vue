<template>
  <div ref="energyForecast" class="h-96 w-auto"></div>
</template>

<script setup lang="ts">
  import { FingridOpenData } from '@/types/FingridOpenData';
  import { onMounted, ref } from 'vue';
  import * as echarts from 'echarts';

  let chart: echarts.ECharts;
  const energyForecast = ref<HTMLElement>();

  onMounted(async () => {
    const client = new FingridOpenData(import.meta.env.VITE_FINGRID_APIKEY);
    const forecasts = await client.getForecast();

    chart = echarts.init(energyForecast.value!);
    chart.setOption({
      dataset: [
        {
          source: forecasts.consumption,
        },
        {
          source: forecasts.production,
        },
        {
          source: forecasts.wind,
        },
      ],
      animation: false,
      color: ['#000000'],
      xAxis: {
        type: 'time',
      },
      yAxis: {
        axisLabel: {
          formatter: '{value} MW',
        },
      },
      series: [
        {
          name: 'consumption',
          type: 'line',
          datasetIndex: 0,
          smooth: true,
          sampling: 'lttb',
          showSymbol: false,
          endLabel: {
            show: true,
            formatter: function (params: any) {
              return params.seriesName;
            },
          },
        },
        {
          name: 'production',
          type: 'line',
          datasetIndex: 1,
          smooth: true,
          sampling: 'lttb',
          showSymbol: false,
          label: {
            show: true,
            position: 'top',
          },
          lineStyle: {
            width: 0,
          },
          areaStyle: {
            opacity: 0.1,
            color: '#000000',
          },
        },
        {
          name: 'wind',
          type: 'line',
          datasetIndex: 2,
          smooth: true,
          sampling: 'lttb',
          showSymbol: false,
          endLabel: {
            show: true,
            formatter: function (params: any) {
              return params.seriesName;
            },
          },
          lineStyle: {
            width: 0,
          },
          areaStyle: {
            opacity: 0.1,
            color: '#000000',
          },
        },
      ],
    });
  });
</script>

<style scoped></style>
