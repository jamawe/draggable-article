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

// GENERAL
/**
 * Sets disabled props in objects of sectionsToSelect array to false based on unique sections already existing in articleForForm
 */
function disableSectionsBasedOnArticle() {
  articleForForm.value.forEach(section => {
    // If prev select is unique section, disable option in select
    if (state.value.uniqueSections.includes(section.name)) {
      const i = findIndexOfUniqueSection(section.name);
      setDisabledOnSectionsToSelect(i, true);
    } 
  });
}

/**
 * Returns the index of a section in articleForForm by its id prop
 * @param {number} sectionId The id of the section 
 * @returns {number} The index of the section in articleForForm
 */
function findArticleSectionIndex(sectionId) {
  return articleForForm.value.findIndex(section => section.id === sectionId);
}

/**
 * Adds an empty section object to the articleForForm array
 */
function addSection() {
  const newSection = { name: '', id: generateId(), errors: { value: '' } };
  articleForForm.value.push(newSection);
}

// TODO Delete section
/**
 * Removes the section from the article
 * @param {object} section The section that should be deleted
 */
function handleDelete(section) {
  // Get index of section in article
  const indexSection = findArticleSectionIndex(section.id);

  // TODO Save section object to store in case user wants to undo delete
  // ...

  // If a section that ought to be unique gets deleted, set its disabled prop to true to make it selectable again
  if (state.value.uniqueSections.includes(section.name)) {
    const index = findIndexOfUniqueSection(section.name);
    setDisabledOnSectionsToSelect(index, false);
  }

  // If deleted sections was an image, check whether is_title_image was checked
  if (section.name === 'image') {
    const isTitleImage = document.querySelector(`#imageTitleImage-${section.id}`).checked;

    if (isTitleImage) {
      [...getAllTitleImageCheckboxes()].forEach(checkbox => checkbox.disabled = false);
    }
  }

  deleteSection(indexSection);
}

/**
 * Deletes the section object from the articleForForm array
 * @param {number} indexSection The index of the section in the articleFormForm array
 */
function deleteSection(indexSection) {
  articleForForm.value.splice(indexSection, 1);
}

// SELECT
/**
 * Save the previously selected option on the focus event of a select element.
 * @param {string} previousSelect The previously selected option
 */
function setPreviousSelect(previousSelect) {
  state.value.previousSelect = previousSelect;
}

/**
 * Handler that manages the change of an option in the section select element.
 * @param {string} newSelect The newly selected option
 * @param {string} sectionId The id of the section
 * @returns {undefined} Undefined (explicit) if the newly selected option is the same as the previously selected one or nothing
 */
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

  if (newSelect === 'image') {
    // 1. Get all titleImage checkboxes
    // 2. Check if one of them is checked
    const hasTitleImage = [...getAllTitleImageCheckboxes()].some(({ checked }) => checked === true);

    // If one is already checked, disable titleImage checkbox on this new image section
    if (hasTitleImage) {
      // setTimeout needed for checkbox to render
      const titleImageTimeout = setTimeout(() => {
        document.querySelector(`#imageTitleImage-${sectionId}`).disabled = true;
        clearTimeout(titleImageTimeout);
      }, 150);
    }
  }
}

/**
 * Returns the index of the uniqueSection in the sectionsToSelect array by its name prop
 * @param {string} uniqueSection A section that only should appear once per article
 * @returns {number} The index of the uniqueSection in the sectionsToSelect array
 */
function findIndexOfUniqueSection(uniqueSection) {
  const i = state.value.sectionsToSelect.findIndex(section => section.name === uniqueSection);
  return i;
}

/**
 * Sets the disabled prop on an object of the sectionsToSelect array by its index
 * @param {number} indexSection The index of objects in sectionsToSelect
 * @param {boolean} isDisabled The value to which the disabled prop should be set
 */
function setDisabledOnSectionsToSelect(indexSection, isDisabled) {
  state.value.sectionsToSelect[indexSection].disabled = isDisabled;
}

/**
 * Resets the props of a section according to its type after a new option was selected
 * @param {string} sectionName The name (type) of the section
 * @param {number} sectionId The id of the section
 */
function resetSectionAfterSelectChange(sectionName, sectionId) {
  // Get index of sectionName in articleForForm
  const i = findArticleSectionIndex(sectionId);

  // Reset props sectionName object
  switch (sectionName) {
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

// IMAGE SECTION
/**
 * Checks the file for its correct type and sets the img element's src attribute of the respective image section
 * @param {array} filesArray The files array of a file input event
 * @param {number} sectionId The id of the section
 */
function handleImage(filesArray, sectionId) {
  // Only one image can be selected for now
  const [file] = filesArray;

  // Handle cancelled upload
  if (!file) return;
  // Validate file type
  if (!file.type.includes('image')) return;

  // Select DOM elements relevant to display image upload progress
  const imagePreview = document.querySelector(`#imagePreview-${sectionId}`);
  imagePreview.src = URL.createObjectURL(file);
}

/**
 * Handler for checking/unchecking is_title_image checkboxes depending on whether a title image already exists in the article
 * @param {boolean} isChecked The checkbox input value
 * @param {number} sectionId The id of the section
 */
function handleCheckboxAction(isChecked, sectionId) {
  // 1. Get all titleImage checkboxes + convert NodeList to array with spread operator
  // 2. Filter checkboxes that don't have the current sectionId
  const otherCheckboxes = [...getAllTitleImageCheckboxes()].filter(({ id }) => id !== `imageTitleImage-${sectionId}`);

  // Disable other image checkboxes if one is checked (true)
  if (isChecked) otherCheckboxes.forEach(checkbox => checkbox.disabled = true);
  // Enable other image checkboxes if one is unchecked (false)
  if (!isChecked) otherCheckboxes.forEach(checkbox => checkbox.disabled = false);
}

/**
 * Returns a NodeList of all checkboxes that start with the id 'imageTitleImage'
 * @returns {NodeList} A NodeList of checkbox input fields
 */
function getAllTitleImageCheckboxes() {
  return document.querySelectorAll(`[id^="imageTitleImage"]`);
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
            <label for="">Section</label>
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
              <label :for="`imageFile_${element.id}`">
                <span>Choose Image</span>
              </label>
              <input
                @change="handleImage($event.target.files, element.id)"
                type="file"
                :name="`imageFile_${element.id}`"
                :id="`imageFile_${element.id}`"
                accept="image/*">
            </div>

            <!-- Preview with progress bar -->
            <div>
              <img src="" :id="`imagePreview-${element.id}`" style="max-height: 150px;object-fit: contain;">
            </div>

            <!-- Name -->
            <!-- <div></div> -->

            <!-- Alt text -->
            <div>
              <label :for="`imageAlt-${element.id}`">Alternative text</label>
              <textarea
                v-model.trim="element.alt"
                :name="`imageAlt-${element.id}`"
                :id="`imageAlt-${element.id}`"
                cols="30" rows="2"></textarea>
            </div>

            <!-- Title image -->
            <div>
              <label :for="`imageTitleImage-${element.id}`">
                <span>Title image</span>
                <input
                  v-model="element.is_title_image"
                  @change="handleCheckboxAction($event.target._modelValue, element.id)"
                  type="checkbox"
                  :name="`imageTitleImage-${element.id}`"
                  :id="`imageTitleImage-${element.id}`">
              </label>
            </div>
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
              <label for="">Content</label>
              <textarea name="" id="" cols="30" rows="2"></textarea>
            </div>
          </template>

          <!-- DELETE SECTION -->
          <div>
            <button
              @click="handleDelete(element)"
              type="button">
              Delete
            </button>
          </div>
        </div>
      </template>
    </draggable>

    <!-- ADD SECTION -->
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
