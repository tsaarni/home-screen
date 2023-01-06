<script setup lang="ts">
  import WeatherForecast from './components/WeatherForecast.vue';
  import EnergyForecast from './components/EnergyForecast.vue';
  import TimeAndDate from './components/TimeAndDate.vue';
</script>

<template>
  <header></header>

  <main>
    <WeatherForecast />
    <EnergyForecast />
    <TimeAndDate />
  </main>
</template>

<style scoped></style>
