<template>
  <div class="container">
    <div class="kanban-list">
      <KanbanColumnComponent
          v-for="(col, index) in kanbanData"
          :key="`column-${index}`"
          :title="col.title"
          :color="col.color"
          :value="col.value"
          :index="index"
          @onDrop="onDrop($event, index)"
          @input="onInput($event, index)"
      />
    </div>
  </div>
</template>

<script>
  import KanbanColumnComponent from './KanbanColumnComponent.vue';

  export default {
    name: 'KanbanComponent',
    components: {
      KanbanColumnComponent,
    },
    data() {
      return {
        kanbanData: [
          {
            title: 'На согласовании',
            color: '#FF99E9',
            value: [],
          },
          {
            title: 'Новые',
            color: '#66B8FF',
            value: [],
          },
          {
            title: 'В процессе',
            color: '#FFD466',
            value: [],
          },
          {
            title: 'Готово',
            color: '#53C666',
            value: [],
          },
          {
            title: 'Доработать',
            color: '#F76E85',
            value: [],
          },
        ],
      };
    },
    methods: {
      onDrop({insertIndex, removeIndex, removeColumnIndex}, insertColumnIndex) {
        const cloned = JSON.parse(JSON.stringify(this.kanbanData));

        const [movedItem] = cloned[removeColumnIndex].value.splice(removeIndex, 1);

        const correctedIndex = removeColumnIndex === insertColumnIndex && insertIndex > removeIndex
            ? insertIndex - 1
            : insertIndex;

        cloned[insertColumnIndex].value.splice(correctedIndex, 0, movedItem);

        this.kanbanData = cloned;

        if (removeColumnIndex !== insertColumnIndex) {
          this.$toast(`Задача перенесена в «${cloned[insertColumnIndex].title}»`, movedItem.text);
        }
      },
      onInput(val, index) {
        const cloned = JSON.parse(JSON.stringify(this.kanbanData));
        cloned[index] = {...cloned[index], value: val};
        this.kanbanData = cloned;
      },
    },
  };
</script>
