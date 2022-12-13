<script setup>
const props = defineProps({
    compProps: Object
});
</script>

<template>
    <h2 class="subheading">{{ props.compProps.subheading }}</h2>
</template>