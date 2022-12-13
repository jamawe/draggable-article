<script setup>
import ArticleDisplayListItem from './ArticleDisplayListItem.vue';

const props = defineProps({
    compProps: Object
});
</script>

<template>
    <ul class="listarray">
        <ArticleDisplayListItem
            v-for="(item, j) in props.compProps.items" :key="j"
            :item="item"
            class="listarray-item" />
    </ul>
</template>