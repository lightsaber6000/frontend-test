<template>
  <div
    role="dialog"
    aria-modal="true"
    :aria-labelledby="`modal-${uid}`"
    class="modal"
    v-if="internalValue"
    ref="modal"
  >
    <div v-click-outside="clickOutside" class="modal__container" ref="modalContainer" tabindex="0">
      <div class="modal__header" v-if="title">
        <h3 class="modal__title" :id="`modal-${uid}`" aria-live="polite">
          {{ title }}
        </h3>
        <button type="button" class="button-icon modal__close-button" @click="closePopup()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#86949E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="modal__body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import useUniqueId from '../utils/uid';

export default {
  name: 'modal',
  props: {
    title: {
      type: String,
      default: null,
    },
    value: {
      type: Boolean,
      default: false,
    },
    previousFocus: String,
  },
  data() {
    return {
      uid: useUniqueId(),
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
    closePopup() {
      this.internalValue = false;
    },
    getScrollbarWidth() {
      const isScrollbarVisible = document.documentElement.scrollHeight > window.innerHeight;
      if (!isScrollbarVisible) return 0;
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.scrollbarWidth = 'initial';
      outer.style.overflow = 'scroll';
      outer.style.msOverflowStyle = 'scrollbar';
      document.body.appendChild(outer);
      const inner = document.createElement('div');
      outer.appendChild(inner);
      const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
      outer.parentNode.removeChild(outer);
      return `${scrollbarWidth}px`;
    },
    toggleBodyBlock(status) {
      if (status) {
        document.body.classList.add('is-blocked');
        document.body.style.paddingRight = this.getScrollbarWidth();
        this.$nextTick(() => {
          this.internalValue = true;
          this.$refs.modalContainer.focus();
        });
      } else {
        document.body.classList.remove('is-blocked');
        document.body.style.paddingRight = '';
        if (this.previousFocus) {
          this.$nextTick(() => {
            document.querySelector(this.previousFocus).focus();
          });
        }
        this.internalValue = false;
      }
    },
    clickOutside() {
      this.internalValue = false;
    },
  },
  watch: {
    value(val) {
      this.toggleBodyBlock(val);
    },
  },
};
</script>

<style lang="scss">
.modal {
  position: fixed;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1010;
  display: flex;
  align-items: center;
  justify-content: center;
  &::after {
    content: '';
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: var(--black-color);
    opacity: 0.5;
  }
  &__title {
    font-size: 24px;
    line-height: 30px;
    font-weight: 600;
    margin-bottom: 24px;
  }
  &__container {
    display: inline-block;
    vertical-align: top;
    position: relative;
    z-index: 5;
    outline: none;
    width: 100%;
    max-width: 500px;
    background-color: #fff;
    padding: 24px 40px 40px 40px;
  }
  &__header {
    display: flex;
  }
  &__close-button {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 16px;
    right: 16px;
    &:hover:not(:disabled) {
      background-color: var(--lightblue-color);
    }
  }
}
</style>
