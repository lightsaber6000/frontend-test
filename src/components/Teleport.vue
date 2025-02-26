<template>
  <div ref="teleportContainer">
    <slot :y="resultY" :x="resultX"></slot>
  </div>
</template>

<script>
  export default {
    name: 'Teleport',
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      top: {
        type: Number,
        default: 0,
      },
      right: {
        type: Number,
        default: null,
      },
    },
    data() {
      return {
        contentNode: null,
        resultY: null,
        resultX: null,
      };
    },
    watch: {
      value(newVal) {
        this.$nextTick(() => {
          const {top, left} = this.$refs.teleportContainer.parentNode.getBoundingClientRect();
          this.resultY = top + this.top;
          this.resultX = left + this.right;
          if (newVal) this.moveToBody();
        });
      },
    },
    mounted() {
      if (this.value) this.moveToBody();
    },
    beforeDestroy() {
      if (this.contentNode) this.contentNode.remove();
    },
    methods: {
      moveToBody() {
        this.$nextTick(() => {
          this.contentNode = this.$refs.teleportContainer.firstElementChild;
          if (this.contentNode) {
            document.body.appendChild(this.contentNode);
          }
        });
      },
    },
  };
</script>
