<template>
  <TransitionGroup class="toast" name="fade" tag="div" appear>
    <div class="toast__message"
         role="alert"
         aria-live="assertive"
         v-for="item in messages"
         :key="`toast-message-${item.id}`">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
           class="toast__icon">
        <g clip-path="url(#clip0_3914_66)">
          <circle cx="12" cy="12" r="12" fill="#22C33D"/>
          <path d="M16.8 8.39996L10.2 15L7.19998 12" stroke="white" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round"/>
        </g>
        <defs>
          <clipPath id="clip0_3914_66">
            <rect width="24" height="24" fill="white"/>
          </clipPath>
        </defs>
      </svg>
      <p class="toast__title" v-html="item.title"></p>
      <p class="toast__text" v-html="item.message"></p>
      <button class="button-icon toast__close-button" @click="onClose(item.id)">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L4 12M4 4L12 12" stroke="#86949E" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </TransitionGroup>
</template>

<script>
  import EventBus from './event-bus';

  export default {
    data() {
      return {
        messages: [],
        count: 0,
        timeOut: 5000,
        maxMessages: 4,
      };
    },
    mounted() {
      EventBus.$on('toast-message', this.handleMessage);
    },
    methods: {
      handleMessage(options) {
        this.addMessage(options);
      },
      addMessage({title, message}) {
        this.count += 1;
        const id = this.count;

        this.messages.push({
          id,
          message,
          title,
          timer: this.startTimer(id),
        });

        if (this.messages.length > this.maxMessages) {
          this.messages.shift();
        }
      },
      startTimer(id) {
        return setTimeout(() => this.remove(id), this.timeOut);
      },
      onClose(id) {
        this.remove(id);
      },
      remove(id) {
        this.messages = this.messages.filter(el => el.id !== id);
      },
    },
  };
</script>

<style lang="scss">
  .toast {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 999;
    width: 100%;
    max-width: 400px;

    &__message {
      position: relative;
      padding: 20px 20px 20px 64px;
      min-height: 80px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      background-color: #fff;
      border: 1px solid var(--gray-color);
      border-radius: 4px;
      box-shadow: 0 8px 16px 0 #0000000F;
      margin-top: 20px;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 4px 0 0 4px;
        background-color: var(--green-color);
        width: 8px;
        height: 100%;
      }
    }

    &__title {
      font-size: 14px;
      line-height: 18px;
      margin-bottom: 8px;
      font-weight: 600;
    }

    &__text {
      font-size: 14px;
      line-height: 18px;
      color: var(--np-white);
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
    }

    &__icon {
      width: 25px;
      height: 25px;
      flex-shrink: 0;
      color: var(--np-white);
      position: absolute;
      left: 24px;
      top: 16px;
    }

    &__close-button {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 16px;
      height: 16px;
      &:hover:not(:disabled) {
        background-color: var(--lightblue-color);
      }
    }
  }

</style>
