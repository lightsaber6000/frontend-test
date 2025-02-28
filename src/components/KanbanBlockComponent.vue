<template>
    <div class="kanban-block" :draggable="`${value.readOnly}`">
        <div class="kanban-block__info" v-if="value.readOnly">
            <p class="kanban-block__info-text">{{ value.text }}</p>
            <button class="button-icon kanban-block__menu-button" @click="onMenuToggle">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 10.8333C10.4602 10.8333 10.8333 10.4602 10.8333 10C10.8333 9.53977 10.4602 9.16667 10 9.16667C9.53976 9.16667 9.16667 9.53977 9.16667 10C9.16667 10.4602 9.53976 10.8333 10 10.8333Z" stroke="#86949E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15.8333 10.8333C16.2936 10.8333 16.6667 10.4602 16.6667 10C16.6667 9.53977 16.2936 9.16667 15.8333 9.16667C15.3731 9.16667 15 9.53977 15 10C15 10.4602 15.3731 10.8333 15.8333 10.8333Z" stroke="#86949E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4.16667 10.8333C4.6269 10.8333 5 10.4602 5 10C5 9.53977 4.6269 9.16667 4.16667 9.16667C3.70643 9.16667 3.33333 9.53977 3.33333 10C3.33333 10.4602 3.70643 10.8333 4.16667 10.8333Z" stroke="#86949E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <KanbanMenuComponent
                v-model="menuOpen"
                @edit="onEdit"
                @delete="onDelete"
            />
        </div>
        <div class="kanban-block__field-wrapper" v-else>
            <textarea
                ref="textarea"
                placeholder="Введите текст.."
                @input="onResizeTextarea"
                class="kanban-block__textarea"
                v-model="value.text">
            </textarea>
            <div class="kanban-block__button-list">
                <button class="button-icon kanban-block__close-button" @click="onCancel">
                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.6 5L5.60001 15M5.60001 5L15.6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="button-icon kanban-block__accept-button" @click="onAccept">
                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.2667 5L8.1 14.1667L3.93333 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
        <ModalComponent
            v-model="showModal"
            title="Удалить задачу?">
                <div class="modal-content">
                    <p class="modal-content__text">
                    {{ value.text }}
                    </p>
                    <div class="modal-content__button-list">
                        <button class="button modal-content__button" @click="onModalRemove">Удалить</button>
                        <button class="button modal-content__button" @click="onModalCancel">Отменить</button>
                    </div>
                </div>
        </ModalComponent>
    </div>
</template>

<script>
    import KanbanMenuComponent from './KanbanMenuComponent.vue';
    import ModalComponent from './ModalComponent.vue';

    import useUniqueId from '../utils/uid';

    export default {
        name: 'KanbanBlockComponent',
        components: { KanbanMenuComponent, ModalComponent },
        props: {
            value: {
                type: Object,
                default: () => {},
            },
        },
        data() {
            return {
                menuOpen: false,
                showModal: false,
                uid: useUniqueId(),
            };
        },
        methods: {
            onModalCancel() {
                this.showModal = false;
            },
            onModalRemove() {
                this.$toast('Задача удалена', this.value.text);
                this.$emit('delete');
                this.showModal = false;
            },
            onCancel() {
                if (this.value.acceptedValue == null) {
                    this.$emit('delete');
                } else {
                    this.$emit('input', {
                        ...this.value,
                        text: this.value.acceptedValue,
                        readOnly: true,
                    });
                }
            },
            onDelete() {
                this.showModal = true;
                this.menuOpen = false;
            },
            onAccept() {
                if (!this.value.text) return;
                this.$emit('input', {
                    ...this.value,
                    readOnly: true,
                    acceptedValue: this.value.text,
                });
                this.$emit('accept', {
                    new: this.value.acceptedValue == null,
                });
            },
            textareaAutosize() {
                const textarea = this.$refs.textarea;
                textarea.style.height = 'auto';
                this.$nextTick(() => {
                    textarea.style.height = `${textarea.scrollHeight + 2}px`;
                });
            },
            onResizeTextarea() {
                this.textareaAutosize();
            },
            onMenuToggle() {
                this.menuOpen = !this.menuOpen;
            },
            onEdit() {
                this.$emit('input', { ...this.value, readOnly: false });
                this.$nextTick(() => {
                    this.textareaAutosize();
                    this.focus();
                });
            },
            focus() {
                this.$refs.textarea.focus();
            },
        },
    };
</script>

<style lang="scss">
.kanban-block {
    display: flex;
    flex-shrink: 0;
    &__field-wrapper {
        display: flex;
        position: relative;
    }
    &__button-list {
        display: flex;
        padding: 4px 8px 0 8px;
        flex-direction: column;
        position: absolute;
        right: 0;
        top: 0;
    }
    &__textarea {
        width: 100%;
        min-height: 52px;
        box-sizing: border-box;
        border: 1px solid var(--gray-color);
        font-family: var(--base-font);
        font-size: 14px;
        line-height: 18px;
        padding: 8px 24px 8px 8px;
        border-radius: 4px;
        resize: none;
        &::placeholder {
            font-size: 14px;
            line-height: 18px;
            color: var(--gray4-color);
        }
        &:focus {
            outline-color: var(--blue-color);
        }
    }
    &__menu-button {
        position: absolute;
        top: 4px;
        right: 4px;
        color: var(--gray-color);
        &:hover:not(:disabled) {
            background-color: var(--lightblue-color);
        }
    }
    &__close-button {
        color: var(--red-color);
        &:hover:not(:disabled) {
            color: var(--red-accent-color);
        }
    }
    &__accept-button {
        color: var(--green-color);
        &:hover:not(:disabled) {
            color: var(--green-accent-color);
        }
    }
    &__info {
        width: 100%;
        padding: 8px 24px 8px 8px;
        box-sizing: border-box;
        overflow-wrap: break-word;
        border: 1px solid var(--gray3-color);
        border-radius: 4px;
        position: relative;
    }
    &__info-text {
        font-size: 14px;
        line-height: 18px;
    }
}
</style>
