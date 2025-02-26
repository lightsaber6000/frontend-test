<template>
  <main class="app">
    <KanbanComponent/>
    <Toast/>
  </main>
</template>

<script>
  import KanbanComponent from './components/KanbanComponent.vue';

  export default {
    name: 'App',
    components: {
      KanbanComponent,
    },
  };
</script>
