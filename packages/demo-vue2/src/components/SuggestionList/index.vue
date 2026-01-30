<template>
    <div class="bn-suggestion-menu">
        <template v-if="suggestions.length">
            <div v-for="(item, index) in suggestions" :key="item.id" class="suggestion-menu-item"
                :class="{ active: index === selectedIndex }" @mousedown.prevent="handleItemClick(item)">
                {{ item.label }}
            </div>
        </template>

        <div v-else class="suggestion-menu-item disabled">无数据</div>
    </div>
</template>

<script lang="ts" src="./index.ts">

</script>


<style scoped>
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
