<script setup>
const props = defineProps({
    item: String
});
</script>

<template>
    <li>
        {{ props.item }}
    </li>
</template>