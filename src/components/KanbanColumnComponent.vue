<template>
  <div class="kanban-list__column" v-droppable="`#column-${uid}`">
    <h2 class="kanban-list__title" :style="`background-color:${color}`">
      {{ title }}
    </h2>
    <div class="kanban-list__inner">
      <div class="kanban-list__list" :id="`column-${uid}`" :data-index="index" v-if="value.length">
        <KanbanBlockComponent
            v-draggable
            v-for="(blockValue, index) in value"
            :key="`block-${index}`"
            :value="blockValue"
            :id="`kanban-block-${uid}-${index}`"
            ref="listItems"
            @accept="onAccept($event, index)"
            @delete="onDelete(index)"
            @input="onInput($event, index)"
        />
      </div>
      <button @click="onAddItem"
              class="button-icon kanban-list__add-button"
              v-if="!addInProcess">
        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.2 4.16667V15.8333M4.36668 10H16.0334" stroke="#3D86F4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Добавить
      </button>
    </div>
  </div>
</template>

<script>
  import KanbanBlockComponent from './KanbanBlockComponent.vue';
  import draggable from '../directives/draggable';
  import droppable from '../directives/droppable';

  import useUniqueId from '../utils/uid';

  export default {
    directives: {
      draggable,
      droppable,
    },
    name: 'KanbanColumnComponent',
    components: {
      KanbanBlockComponent,
    },
    props: {
      title: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        default: '#FFD466',
      },
      index: {
        type: Number,
        default: null,
      },
      value: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        addInProcess: false,
        uid: useUniqueId(),
      };
    },
    methods: {
      handleDrop(insertIndex, removeIndex, removeColumnIndex) {
        this.$emit('onDrop', {
          insertIndex,
          removeIndex,
          removeColumnIndex,
        });
      },
      onAddItem() {
        this.$emit('input', [...this.value, {
          text: '',
          id: useUniqueId(),
          acceptedValue: null,
          readOnly: false,
        }]);
        this.addInProcess = true;
        this.$nextTick(() => {
          const lastElement = this.$refs.listItems?.[this.$refs.listItems.length - 1];
          lastElement.focus();
        });
      },
      onAccept(val, index) {
        this.addInProcess = false;
        this.$nextTick(() => {
          if (val.new) {
            this.$toast(`Задача создана в «${this.title}»`, this.value[index].text);
          }
        })
      },
      onInput(val, index) {
        const cloned = JSON.parse(JSON.stringify(this.value));
        cloned[index] = val;
        this.$emit('input', cloned);
      },
      onDelete(index) {
        const cloned = JSON.parse(JSON.stringify(this.value));
        cloned.splice(index, 1);
        this.$emit('input', cloned);
        this.addInProcess = false;
      },
    },
  }
</script>

<style lang="scss">
  .kanban-list {
    display: flex;
    gap: 8px;
    height: 100%;

    &__column {
      flex-grow: 1;
      flex-basis: 178px;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--gray-color);
    }

    &__title {
      display: block;
      padding-top: 7px;
      padding-bottom: 7px;
      font-size: 14px;
      line-height: 17.5px;
      font-weight: 600;
      text-align: center;
    }

    &__inner {
      padding: 4px 12px 20px 4px;
      margin: 4px 4px 4px 0;
      overflow-y: auto;
      flex-grow: 1;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--gray3-color);
        border-radius: 10px;

        &:hover {
          background: #555;
        }
      }

      &::-webkit-scrollbar-button {
        display: none;
      }
    }

    &__list {
      gap: 8px;
      display: flex;
      flex-direction: column;
      margin-bottom: 8px;
      position: relative;
    }

    &__add-button {
      color: var(--blue-color);
      font-size: 14px;
      line-height: 18px;
      &:hover:not(:disabled) {
        color: var(--blue-accent-color);
      }
    }
  }
</style>
