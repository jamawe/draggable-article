<script setup>
const props = defineProps({
    compProps: Object
});
</script>

<template>
    <h1 class="heading">{{ props.compProps.heading }}</h1>
</template>