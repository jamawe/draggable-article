<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
const templateBasic = [
  { key: 'heading', value: '', id: generateId(), errors: { value: '' } },
  { key: 'summary', value: '', id: generateId(), errors: { value: '' } },
  { key: 'paragraph', value: '', id: generateId(), errors: { value: '' } },
]

function generateId() {
  return Math.floor(Date.now() * Math.random());
}

const sectionsToSelect = [
  'heading', 'image', 'listarray', 'paragraph', 'subheading', 'summary', 'table'
];

// Create deep template copy
// NOTE: Can be skipped if template logic will not be implemented
const articleForForm = JSON.parse(JSON.stringify(templateBasic));
const articleForDisplay = []; // Derive from articleForForm
</script>

<template>
  <div class="form">
  </div>
  
  <!-- <div class="display">

  </div> -->
</template>

<style scoped>
</style>
