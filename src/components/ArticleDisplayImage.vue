<script setup>
const props = defineProps({
    compProps: Object
});
</script>

<template>
    <img :src="props.compProps.url" :alt="props.compProps.alt" class="image">
</template>