<template>
    <div class="bn-suggestion-menu">
        <div v-if="suggestions.length" class="suggestion-menu-item" :class="{ active: index === selectedIndex }"
            v-for="(item, index) in suggestions" :key="item.id" @mousedown.prevent="onItemClickInternal(item)">
            {{ item.label }}
        </div>
        <div class="suggestion-menu-item disabled" v-else>无数据</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { SuggestionItem } from '@shenjipo/mention-vue3';
import { useSuggestionMenuKeyboardNavigation } from '@shenjipo/mention-vue3';

const props = defineProps<{
    editor: MEditor
    query: string
    closeMenu: () => void
    clearQuery: () => void
    insertMention: (item: SuggestionItem) => void
}>()

const suggestions = ref<Array<SuggestionItem>>([
    { id: '1', label: '帮我写作' },
    { id: '2', label: '编程' },
    { id: '3', label: '图像生成' },
    { id: '4', label: '解题答疑' },
    { id: '5', label: '音乐生成' },
    { id: '6', label: '数据分析' },
])

const onItemClickInternal = (item: SuggestionItem) => {
    props.closeMenu()
    props.clearQuery()
    props.insertMention(item)
}

const selectedIndex = useSuggestionMenuKeyboardNavigation<SuggestionItem>(props.editor, props.query, suggestions, onItemClickInternal)


</script>

<style lang="scss" scoped>
.bn-suggestion-menu {
    width: 180px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    font-size: 14px;
    padding: 4px;

    .suggestion-menu-item {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
            background-color: #f1f5f9;
        }

        span {
            flex: 1;
        }
    }

    .suggestion-menu-item.active {
        background-color: #f1f5f9;
    }

    .suggestion-menu-item.disabled {
        background-color: unset;
        cursor: not-allowed;
    }
}
</style>
