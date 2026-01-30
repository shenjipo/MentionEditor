<template>
    <div v-if="showDom" ref="floatingRef" :style="style">
        <slot v-bind="suggestionMenuProps">

        </slot>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted, inject, Ref } from 'vue';
import type { SuggestionMenuState } from '@shenjipo/mention-editor';
import MEditor from '@shenjipo/mention-editor';
import { useUIElementPositioning } from '@/hooks/useUIElementPositioning';
import { flip, offset, shift, size } from '@floating-ui/vue'

const props = defineProps<{
    triggerCharacter: string,
    minQueryLength?: number,
}>()

const state = ref<SuggestionMenuState | null>(null)

const editor = inject<Ref<MEditor>>('editor')
const showDom = computed(() => {
    const res = state.value?.show &&
        (!props.minQueryLength ||
            state.value.ignoreQueryLength ||
            (!state.value.query.startsWith(' ') &&
                state.value.query.length >= props.minQueryLength))

    return res === undefined ? false : res
})

const { floatingRef, style } = useUIElementPositioning(
    () => showDom.value,
    () => state.value?.referencePos || null,
    2000,
    {
        placement: 'bottom-start',
        middleware: [
            offset(10),
            flip({ mainAxis: true, crossAxis: false }),
            shift(),
            size({
                apply({ availableHeight, elements }) {
                    Object.assign(elements.floating.style, {
                        maxHeight: `${availableHeight - 10}px`,
                    })
                },
            }),
        ],
        onDismiss() {

        },
    }
)


let unsubscribe: any = null

onMounted(() => {
    unsubscribe = editor?.value.suggestionMenus.onUpdate(
        props.triggerCharacter,
        (newState) => {
            state.value = newState
        }
    )
})

onUnmounted(() => {
    unsubscribe?.()
})

const closeMenu = () => {
    editor!.value.suggestionMenus.closeMenu()
}

const clearQuery = () => {
    editor!.value.suggestionMenus.clearQuery()
}

const insertMention = (item: any) => {
    editor!.value.inserMentionBlock(item)
}

const suggestionMenuProps = computed(() => ({
    editor: editor.value,
    query: state!.value?.query ?? '',
    closeMenu,
    clearQuery,
    insertMention,
}))

</script>

<style scoped></style>
