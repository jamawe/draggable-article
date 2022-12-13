<script setup>
const props = defineProps({
  compProps: Object
});
</script>

<template>
    <p class="paragraph">{{ props.compProps.paragraph }}</p>
</template>