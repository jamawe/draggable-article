<script setup>
const props = defineProps({
    caption: String
});
</script>

<template>
    <span>
        {{ props.caption }}
    </span>
</template>