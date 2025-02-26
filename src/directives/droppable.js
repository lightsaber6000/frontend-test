import Vue from 'vue';

const droppable = Vue.directive('droppable', {
  bind(el, binding, vnode) {
    let insertBefore = null;
    let insertIndex = null;

    const getDroppedZone = () => document.querySelector(binding.value);

    const reset = () => {
      insertBefore = null;
      insertIndex = null;
    };

    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragOver = (e) => {
      preventDefaults(e);
      const droppedZone = document.querySelector(binding.value);
      let items = droppedZone?.children ? [...droppedZone?.children] : null;
      const { clientY } = e;

      if (items == null) {
        insertIndex = 0;
        return;
      }

      for (const [index, item] of items.entries()) {
        const itemRect = item.getBoundingClientRect();
        if (clientY < itemRect.top + itemRect.height / 2) {
          insertBefore = item;
          insertIndex = index;
          break;
        }
      }

      if (insertBefore == null) {
        insertIndex = items.length;
      }
    };

    const handleDrop = (e) => {
      preventDefaults(e);
      const id = e.dataTransfer.getData('Text');
      const draggedElement = document.getElementById(id);
      const items = [...draggedElement.parentNode.children];
      const removeColumnIndex = Number(draggedElement.parentNode.dataset.index);
      const removeIndex = items.indexOf(draggedElement);
      if (draggedElement) {
        vnode.context.handleDrop(insertIndex, removeIndex, removeColumnIndex);
      }

      reset();
    };

    const handleDragLeave = () => {
      reset();
    };

    el.addEventListener('drop', handleDrop);
    el.addEventListener('dragover', handleDragOver);
    el.addEventListener('dragleave', handleDragLeave);
  },
});

export default droppable;
