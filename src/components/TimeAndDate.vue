<template>
  <div ref="clock" class="h-96 w-auto"></div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import * as echarts from 'echarts';

  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const clock = ref<HTMLElement>();
  let chart: echarts.ECharts;

  const getClockDataset = () => {
    const d = new Date();
    const minute = d.getMinutes();
    const hour = (d.getHours() % 12) + minute / 60;
    const weekday = d.getDay();
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const date = Number(`${day}.${month}`); // Hack: present date as a decimal number.

    return [
      {
        id: 'hour',
        source: [[hour]],
      },
      {
        id: 'minute',
        source: [[minute]],
      },
      {
        id: 'weekday',
        source: [[weekday]],
      },
      {
        id: 'date',
        source: [[date]],
      },
    ];
  };

  const updateFunc = () => {
    if (chart !== undefined) {
      chart.setOption({
        dataset: getClockDataset(),
      });
    }
  };

  // Update once to initialize the values.
  updateFunc();

  // Update every second.
  setInterval(updateFunc, 1000);

  onMounted(() => {
    chart = echarts.init(clock.value!);
    chart.setOption({
      animation: false,
      color: ['#000000'],

      series: [
        {
          name: 'hour',
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          min: 0,
          max: 12,
          splitNumber: 12,
          clockwise: true,
          splitLine: {
            show: true,
            lineStyle: {
              width: 5,
              color: '#000000',
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          pointer: {
            icon: 'roundRect',
            width: 10,
            length: '30%',
          },
          anchor: {
            show: true,
            size: 20,
            showAbove: true,
            itemStyle: {
              color: '#000000',
            },
          },
          detail: {
            show: false,
          },
          datasetIndex: 0,
        },

        {
          name: 'minute',
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          min: 0,
          max: 60,
          splitNumber: 60,
          clockwise: true,
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          pointer: {
            icon: 'roundRect',
            width: 6,
            length: '45%',
          },
          detail: {
            show: false,
          },
          datasetIndex: 1,
        },

        {
          name: 'weekday',
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          min: 0,
          max: 7,
          splitNumber: 7,
          clockwise: true,
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            distance: 25,
            fontSize: 16,
            formatter: (value: number) => {
              return days[value];
            },
          },
          pointer: {
            icon: 'circle',
            showAbove: false,
            width: 35,
            length: '128%',
            itemStyle: {
              opacity: 0.1,
            },
          },
          detail: {
            show: false,
          },
          datasetIndex: 2,
        },

        {
          name: 'date',
          type: 'gauge',
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          pointer: {
            show: false,
          },
          detail: {
            fontSize: 20,
            offsetCenter: [0, '30%'],
          },
          datasetIndex: 3,
        },
      ],
      dataset: getClockDataset(),
    });
  });
</script>

<style scoped></style>
