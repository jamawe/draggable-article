<script setup>
const props = defineProps({
  compProps: Object
});
</script>

<template>
    <p class="summary">{{ props.compProps.summary }}</p>
</template>