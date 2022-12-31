<template>
  <div ref="airTemperatureForecast" class="h-96"></div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import * as echarts from 'echarts';
  import { MetNoWeather, type Temperature } from '@/types/MetNoWeather';

  const airTemperatureForecast = ref<HTMLElement>();
  let chart: echarts.ECharts;

  onMounted(async () => {
    const lat = import.meta.env.VITE_METNO_GEO_COORDINATES_LAT;
    const lon = import.meta.env.VITE_METNO_GEO_COORDINATES_LON;

    const client = new MetNoWeather(import.meta.env.VITE_METNO_USER_AGENT || 'home-screen-app/0.1');
    const forecast = await client.getForecast(lat, lon);

    chart = echarts.init(airTemperatureForecast.value!);

    chart.setOption({
      animation: false,
      color: ['#000000'],
      dataset: [
        {
          source: forecast.temperature,
        },
        {
          source: forecast.precipitation,
        },
      ],
      xAxis: [
        {
          type: 'time',
          //splitNumber: 12,
          minInterval: 3600 * 3 * 1000,
          // maxInterval: 3600 * 3 * 1000,
        },
      ],

      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value} °C',
          },
        },
        {
          type: 'value',
          splitLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value} mm',
          },
        },
      ],

      series: [
        {
          name: 'temperature',
          type: 'line',
          datasetIndex: 0,
          encode: {
            x: 0,
            y: 1,
            symbol: 0,
          },
          smooth: true,
          sampling: 'lttb',
          symbol: (value: Temperature) => value.symbol,
          showSymbol: true,
          symbolSize: 50,
          symbolOffset: [0, '-60%'],
          areaStyle: {
            opacity: 0.1,
            color: '#000000',
          },
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' },
            ],
          },
        },
        {
          name: 'precipitation',
          type: 'bar',
          datasetIndex: 1,
          yAxisIndex: 1,
          itemStyle: {
            opacity: 0.2,
          },
        },
      ],
    });
  });
</script>

<style scoped></style>
