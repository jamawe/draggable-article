<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import draggable from 'vuedraggable';
import { generateId } from './modules/_helpers.mjs';

import { ref } from "vue";

const state = ref({
  templateBasic: [
    { name: 'heading', value: '', id: generateId(), errors: { value: '' } },
    { name: 'summary', value: '', id: generateId(), errors: { value: '' } },
    { name: 'paragraph', value: '', id: generateId(), errors: { value: '' } },
  ],
  sectionsToSelect: [
    { name: 'heading', disabled: false },
    { name: 'image', disabled: false },
    { name: 'listarray', disabled: false },
    { name: 'paragraph', disabled: false },
    { name: 'subheading', disabled: false },
    { name: 'summary', disabled: false },
    { name: 'table', disabled: false },
  ],
  uniqueSections: ['heading', 'summary'],
  previousSelect: '',
});

function disableSectionsBasedOnArticle() {
  articleForForm.value.forEach(section => {
    // If prev select is unique section, disable option in select
    if (state.value.uniqueSections.includes(section.name)) {
      console.log('%c', 'color: darkseagreen; font-weight: bold;', section.name);
      const i = findIndexOfUniqueSection(section.name);
      setDisabledOnSectionsToSelect(i, true);
    } 
  });
}

function addSection() {
  const newSection = { name: '', id: generateId(), errors: { value: '' } };
  articleForForm.value.push(newSection);
}

function setPreviousSelect(previousSelect) {
  console.log('%cpreviousSelect', 'color: darkseagreen; font-weight: bold;', previousSelect);
  state.value.previousSelect = previousSelect;
}

function handleNewSelect(newSelect, sectionId) {
  // If prev + new select are the same, do nothing
  if (state.value.previousSelect === newSelect) return;

  // If prev select is unique section, its option can be enabled again
  if (state.value.uniqueSections.includes(state.value.previousSelect)) {
    const i = findIndexOfUniqueSection(state.value.previousSelect);
    setDisabledOnSectionsToSelect(i, false);
  }

  // If new select is unique section, its option needs to be disabled
  if (state.value.uniqueSections.includes(newSelect)) {
    const i = findIndexOfUniqueSection(newSelect);
    setDisabledOnSectionsToSelect(i, true);
  }

  // Reset section after other option was selected
  resetSectionAfterSelectChange(state.value.previousSelect, sectionId);
}

function findIndexOfUniqueSection(uniqueSection) {
  const i = state.value.sectionsToSelect.findIndex(section => section.name === uniqueSection);
  console.log('%cfindIndexOfUniqueSection i', 'color: darkseagreen; font-weight: bold;', i);
  return i;
}

function setDisabledOnSectionsToSelect(indexSection, isDisabled) {
  state.value.sectionsToSelect[indexSection].disabled = isDisabled;
}

function resetSectionAfterSelectChange(sectionToReset, sectionId) {
  // Get index of sectionToReset in articleForForm
  const i = findArticleSectionIndex(sectionId);
  console.log('%cresetSectionAfterSelectChange i', 'color: darkseagreen; font-weight: bold;', i);

  // Reset props sectionToReset object
  switch (sectionToReset) {
    case 'image':
      articleForForm.value[i].url = '';
      articleForForm.value[i].name = '';
      articleForForm.value[i].alt = '';
      articleForForm.value[i].is_title_image = false;
      articleForForm.value[i].url = '';
      break;
    case 'listarray':
      articleForForm.value[i].items = [];
      break;
    case 'table':
      // TODO Handle table case
      console.log('%cresetSectionAfterSelectChange case table', 'color: darkseagreen; font-weight: bold;');
      break;
    default:
      articleForForm.value[i].value = '';
      break;
  }
}

function findArticleSectionIndex(sectionId) {
  return articleForForm.value.findIndex(section => section.id === sectionId);
}

// Create deep template copy
// NOTE: Can be skipped if template logic will not be implemented
const articleForForm = ref(JSON.parse(JSON.stringify(state.value.templateBasic)));
const articleForDisplay = []; // Derive from articleForForm (const bla = computed() => {return stuff})

disableSectionsBasedOnArticle();
</script>

<template>
  <div class="form">

    <draggable
      v-model="articleForForm"
      item-key="id"
      @start="drag=true" @end="drag=false">
      <template #item="{ element }">
        <div>
          <!-- SELECT SECTION -->
          <div>
            <label for="">Section:</label>
            <select
              v-model="element.name" name="" id="" 
              @focus="setPreviousSelect($event.target.value)"
              @change="handleNewSelect($event.target.value, element.id)">
              <option value selected disabled >Choose A Section</option>
              <option
                v-for="(section, i) in state.sectionsToSelect"
                :key="i"
                :value="section.name"
                :disabled="section.disabled">{{ section.name }}</option>
            </select>
          </div>

          <!-- NO SECTION YET -->
          <template v-if="element.name === ''">
            <div>
              Please remember to choose a section.
            </div>
          </template>

          <!-- IMAGE SECTION -->
          <template v-else-if="element.name === 'image'">
            <!-- Button to choose image -->
            <div>
              <label for="">
                <span>Choose Image</span>
              </label>
              <input type="file" name="" id="" accept="image/*">
            </div>

            <!-- Preview with progress bar -->
            <div></div>

            <!-- Name -->
            <div></div>

            <!-- Alt text -->
            <div></div>

            <!-- Title image -->
            <div></div>
          </template>

          <!-- LISTARRAY SECTION -->
          <template v-else-if="element.name === 'listarray'">
            <div>
              <fieldset>
                <legend>Items</legend>
                <div>
                  <!-- Loop through items -->
                  <div></div>
                </div>
              </fieldset>
            </div>
          </template>

          <!-- TABLE SECTION -->
          <template v-else-if="element.name === 'table'">
            <div>
              
            </div>
          </template>

          <!-- HEADING / PARAGRAPH / SUBHEADING / SUMMARY SECTION -->
          <template v-else>
            <div>
              <label for="">Content:</label>
              <textarea name="" id="" cols="30" rows="2"></textarea>
            </div>
          </template>
        </div>
      </template>
    </draggable>

    <!-- Add section -->
    <div>
      <button
        @click="addSection"
        type="button">
          Add Section
      </button>
    </div>

    {{articleForForm}}

  </div>
  
  <!-- <div class="display">

  </div> -->
</template>

<style scoped>
</style>
