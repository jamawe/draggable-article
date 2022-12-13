<script setup>
import ArticleDisplayHeading from './ArticleDisplayHeading.vue';
import ArticleDisplayImage from './ArticleDisplayImage.vue';
import ArticleDisplayImageContainer from './ArticleDisplayImageContainer.vue';
import ArticleDisplayList from './ArticleDisplayList.vue';
import ArticleDisplayParagraph from './ArticleDisplayParagraph.vue';
import ArticleDisplaySubheading from './ArticleDisplaySubheading.vue';
import ArticleDisplayTable from './ArticleDisplayTable.vue';
import ArticleDisplaySummary from './ArticleDisplaySummary.vue';

import { computed } from 'vue';

const props = defineProps({
  articleForDisplay: Array
});

const articleWithComponents = computed(() => {
  const articleMapped = props.articleForDisplay.map(section => {
    switch (section.name) {
      case 'heading':
        section.component = ArticleDisplayHeading;
        section.compProps = {
          heading: section.value
        };
        break;
      case 'image':
        if (section.is_title_image) {
          section.component = ArticleDisplayImage;
        } else {
          section.component = ArticleDisplayImageContainer;
        }
        section.compProps = {
          url: section.url,
          alt: section.alt,
        }
        break;
      case 'listarray':
        section.component = ArticleDisplayList;
        section.compProps = {
          items: section.items
        };
        break;
      case 'paragraph':
        section.component = ArticleDisplayParagraph;
        section.compProps = {
          paragraph: section.value
        };
        break;
      case 'subheading':
        section.component = ArticleDisplaySubheading;
        section.compProps = {
          subheading: section.value
        };
        break;
      case 'summary':
        section.component = ArticleDisplaySummary;
        section.compProps = {
          summary: section.value
        };
        break;
      case 'table':
        section.component = ArticleDisplayTable;
        section.compProps = {
          table_head: section.table_head,
          rows: section.rows,
        };
        break;
      default:
        break;
      }

      return section;
    });

  return articleMapped;
});
</script>

<template>
    <div class="component">
      <component
        v-for="(section, i) in articleWithComponents"
        :key="section.id"
        :is="section.component"
        :compProps="section.compProps"></component>
    </div>
</template>

<style>
  .preview {
    flex-direction: column;
    align-items: center;
    font-family: Arial, Helvetica, sans-serif;
    text-align: left;
    width: min(100%, 40rem);
    margin-left: auto;
    margin-right: auto;
  }

  .component {
    width: 100%;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .component .heading {
    font-family: Monaco, monospace;
    font-size: 2rem;
    font-weight: bold;
    letter-spacing: .0875rem;
    line-height: 120%;
    text-align: left;
  }

  .component .image {
    position: relative;
    height: 300px;
    width: 100%;
    object-fit: cover;
    border-radius: .25rem;
  }

  .image-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    width: min(95%, 400px);
  }

  .image.no-title-image {
    object-fit: contain;
    height: auto;
    width: 100%;
    margin-bottom: .25rem;
  }

  .caption {
    font-size: 13.5px;
    font-style: italic;
    line-height: 110%;
    text-align: left;
  }

  .listarray {
    display: grid;
    gap: .5rem;
    list-style-type: disc;
    margin-top: .5rem;
  }

  .listarray-item {
    margin-left: 5%;
    padding-left: .5rem;
  }

  .paragraph {
    text-indent: 1rem;
  }

  .subheading {
    font-family: Monaco, monospace;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .summary {
    color: var(--help);
    padding-left: 5%;
    padding-right: 5%;
  }

  .table-container {
    display: flex;
    flex-direction: column;
    margin: .5rem auto;
    border-radius: .75rem;
    border: .0625rem solid var(--border);
    width: 100%;
    max-width: 60ch;
    background-color: var(--surface2);
  }

  .table-container .table {
    table-layout: fixed;
    border-collapse: collapse;
    width: 100%;
  }

  .table-head {
    border-bottom: .03125rem solid var(--border);
  }

  .table-head-row {
    font-family: Monaco, monospace;
    font-weight: bold;
    letter-spacing: .075ch;

  }

  .table-head-cell {
    padding:1rem;
    text-align: left;
    text-transform: uppercase;
    width: 50%;
  }

  .table-head-cell:first-of-type {
    border-top-left-radius: .75rem;
  }

  .table-head-cell:last-of-type {
    border-top-right-radius: .75rem;
  }

  /* .table-body-row {
    border-bottom: .0625rem solid var(--border);
  } */

  .table-body-row:last-of-type {
    border: none;
  }

  .table-body-cell {
    text-align: left;
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-left: .75rem;
    padding-right: 0;
  }
</style>