<script setup lang="ts">
const { data, error } = await useFetch('/api/secure-pokemon')
console.log(data.value)
</script>

<template>
  <div>
    <p>{{ data.id }}</p>
    <p>{{ data.height }}</p>
    <p>{{ data.stats.hp }}</p>
    <img :src=data.sprite_url alt="">
  </div>
</template>