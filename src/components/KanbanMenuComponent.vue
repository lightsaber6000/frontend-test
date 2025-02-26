<template>
  <teleport :value="internalValue" :top="24" :right="135">
    <template slot-scope="{ y, x }">
      <div
          role="menu"
          ref="contextMenu"
          class="kanban-nav"
          :style="{ top: `${y}px`, left: `${x}px` }"
          v-click-outside="onClickOutside"
          v-if="internalValue"
      >
        <button class="kanban-nav__button" @click="onEdit">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.33334 18.3333H17.5M13.3333 1.66667L16.6667 5.00001L7.50001 14.1667H4.16668V10.8333L13.3333 1.66667Z"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Редактировать
        </button>
        <button class="kanban-nav__button" @click="onDelete">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 5.00001H17.5M6.66667 5.00001V3.33334C6.66667 2.89131 6.84226 2.46739 7.15482 2.15483C7.46738 1.84227 7.89131 1.66667 8.33333 1.66667H11.6667C12.1087 1.66667 12.5326 1.84227 12.8452 2.15483C13.1577 2.46739 13.3333 2.89131 13.3333 3.33334V5.00001M15.8333 5.00001V16.6667C15.8333 17.1087 15.6577 17.5326 15.3452 17.8452C15.0326 18.1577 14.6087 18.3333 14.1667 18.3333H5.83333C5.39131 18.3333 4.96738 18.1577 4.65482 17.8452C4.34226 17.5326 4.16667 17.1087 4.16667 16.6667V5.00001H15.8333Z"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Удалить
        </button>
      </div>
    </template>
  </teleport>
</template>

<script>
  import Teleport from './Teleport.vue';

  export default {
    name: 'KanbanMenuComponent',
    components: {
      Teleport,
    },
    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        x: null,
        y: null,
      };
    },
    computed: {
      internalValue: {
        get() {
          return this.value;
        },
        set(newVal) {
          this.$emit('input', newVal);
        },
      },
    },
    methods: {
      onClickOutside() {
        this.internalValue = false;
      },
      onEdit() {
        this.$emit('edit');
      },
      onDelete() {
        this.$emit('delete');
      },
    },
  };
</script>

<style lang="scss">
  .kanban-nav {
    box-shadow: 0px 8px 16px 0px #0000000F;
    background-color: #fff;
    border: 1px solid var(--gray-color);
    padding: 7px 0;
    border-radius: 4px;
    position: fixed;
    &__button {
      box-shadow: none;
      border: 0;
      font-size: 14px;
      line-height: 18px;
      font-family: var(--base-font);
      gap: 8px;
      padding: 5px 10px;
      display: flex;
      width: 100%;
      background-color: transparent;
      cursor: pointer;
      align-items: center;
      svg {
        width: 20px;
        height: 20px;
        color: var(--gray4-color);
      }

      &:hover:not(:disabled) {
        background-color: var(--lightblue-color);
      }
    }
  }
</style>
