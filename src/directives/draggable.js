import Vue from 'vue';

const draggable = Vue.directive('draggable', {
  bind(el) {
    const onDragStart = (e) => {
      e.dataTransfer.setData('Text', el.id);
    };

    el.addEventListener('dragstart', onDragStart);
  },
});

export default draggable;
