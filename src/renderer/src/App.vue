<script setup>

</script>

<template>
  <div class="app">
    <div class="side">
      side
    </div>
    <div class="head">
      head
    </div>
    <div class="content">
      content
      <span class="text-50px c-black">aaaasd</span>
      <span class="i-carbon-logo-github" />
      <span class="i-mdi-light-home" />
    </div>
  </div>
</template>

<style scoped>
.app {
  /* background: rgb(250, 250, 250); */
  width: 100vw;
  height: 100vh;
  display: grid;
  grid: 'side head' 40px 'side content' 1fr / 50px 1fr;
}
.side {
  grid-area: side;
}
.head {
  grid-area: head;
}
.content {
  grid-area: content;
  background: white;
  border-radius: 9px 0 0 0;
}
</style>
