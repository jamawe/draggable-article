<script setup>
import ArticleDisplayImage from './ArticleDisplayImage.vue';
import ArticleDisplayImageCaption from './ArticleDisplayImageCaption.vue';

const props = defineProps({
    compProps: Object
});
</script>

<template>
    <div class="image-container">
        <ArticleDisplayImage 
        :compProps="props.compProps"
        class="image no-title-image"/>
        <ArticleDisplayImageCaption
            v-if="props.compProps.alt" 
            :caption="props.compProps.alt"
            class="caption" />
    </div>
</template>