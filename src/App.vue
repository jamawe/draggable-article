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
  columnLimit: 4,
  previousColumnName: '',
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
      articleForForm.value[i].columns = [];
      articleForForm.value[i].rows = [];
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

// LISTARRAY SECTION
/**
 * Adds an empty item object to the items array of a listarray section
 * @param {number} sectionId The id of the listarray section
 */
function addListArrayItem(sectionId) {
  // Find index of listarray section with id
  const indexListArray = findArticleSectionIndex(sectionId);
  // Check whether items array already exists else create it
  if (articleForForm.value[indexListArray].items === undefined) articleForForm.value[indexListArray].items = [];
  // Push new empty item to listarray section with that id
  articleForForm.value[indexListArray].items.push({
    value: ''
  });
  // Find out index of added item
  const indexItem = articleForForm.value[indexListArray].items.length - 1;
  // Select added listarray item input
  selectListarrayInput(sectionId, indexItem);
}

/**
 * Removes an item from a listarray array
 * @param {number} sectionId The id of the listarray section
 * @param {number} indexItem The index of the newly added item
 */
function deleteListArrayItem(sectionId, indexItem) {
  // Find index of listarray section with sectionId
  const indexListArray = findArticleSectionIndex(sectionId);
  // Delete item in listarray
  articleForForm.value[indexListArray].items.splice(indexItem, 1);
  // TODO Update listarray shrunk section
  // this.handleInputForShrunkSections(sectionId);
}

/**
 * Focuses the input of a newly added listarray item
 * @param {number} sectionId The id of the listarray section 
 * @param {number} indexItem The index of the newly added item
 */
function selectListarrayInput(sectionId, indexItem) {
  const selectTimeout = setTimeout(() => {
    const listarrayItemInput = document.querySelector(`#listarrayItems-${sectionId}-Item${indexItem}`);
    listarrayItemInput.focus();
    clearTimeout(selectTimeout);
  }, 150);
}

// TABLE SECTION
/**
 * Adds a column to a table
 * @param {number} sectionId The id of the table section
 */
function addTableColumn(sectionId) {
  // Find index of table section with id
  const indexTable = findArticleSectionIndex(sectionId);
  // Check whether columns array already exists else create it
  if (articleForForm.value[indexTable].columns === undefined) articleForForm.value[indexTable].columns = [];
  // Disable button for adding columns if limit would be exceeded
  if (articleForForm.value[indexTable].columns.length === state.value.columnLimit) {
    disableTableColumnButton(true, sectionId);
    return;
  }
  // Find out columns array length to set preliminary name for added column
  const indexColumn = articleForForm.value[indexTable].columns.length;
  // Push new empty object with name prop to table section with that id
  articleForForm.value[indexTable].columns.push({
      name: createProvisionalColumnName()
  });
  // Select added col name input for user
  selectTableColumnInput(sectionId, indexColumn);
  // TODO
  // this.handleInputForShrunkSections(sectionId);
}

/**
 * Delete a column name
 * @param {number} sectionId The id of the table section
 * @param {number} indexColumn The index of the column to be deleted
 */
function deleteTableColumn(sectionId, indexColumn) {
  // Find index of table section with sectionId
  const indexTable = findArticleSectionIndex(sectionId);
  // Save columnName to pass as argument to deleteTableCells fn
  const columnName = articleForForm.value[indexTable].columns[indexColumn].name;
  // Delete column object in table columns
  articleForForm.value[indexTable].columns.splice(indexColumn, 1);
  // Delete respective cells from row that belong to column
  deleteTableCells(indexTable, columnName);
  // Enable button for adding columns
  disableTableColumnButton(false, sectionId);
  // Update table shrunk section
  // this.handleInputForShrunkSections(sectionId);
}

/**
 * Create a provisional name for an added column
 */
function createProvisionalColumnName() {
  const randomString = Math.random().toString(36).substring(2, 6);
  // E.g.: Column-7mqr
  return `Column-${randomString}`;
}

/**
 * Selects the newly added column
 * @param {number} sectionId The id of the table section
 * @param {number} indexColumn The index of the column to be added
 */
function selectTableColumnInput(sectionId, indexColumn) {
  const selectTimeout = setTimeout(() => {
    const tableColumnInput = document.querySelector(`#tableCol${indexColumn}-${sectionId}`);
    tableColumnInput.focus();
    tableColumnInput.select();
    clearTimeout(selectTimeout);
  }, 150);
}

/**
 * Enable / disable the button that adds a column to a table
 * @param {boolean} state The state to which the disabled attribute of the button should be set
 * @param {number} sectionId The id of the table section
 */
function disableTableColumnButton(state, sectionId) {
  const tableColumnButton = document.querySelector(`#tableColumnBtn-${sectionId}`);
  tableColumnButton.disabled = state;
}

/**
 * Saves the current column name on focus
 * @param {string} columnName The column name of the column in focus
 */
function saveColumnName(columnName) {
  if (columnName === '') return;
  state.value.previousColumnName = columnName;
}

/**
 * Handler thats manages column name input
 * @param {object} e The blur event object
 * @param {number} sectionId The id of the table section
 * @param {number} indexColumn The index of the column
 */
function handleColumnInput(e, sectionId, indexColumn) {
  // Set currently entered name
  // NOTE: Since props are retrieved via string notation (obj['key']) for now, also characters that would be invalid inside identifiers can be used, like '€'
  const currentColumnName = e.target.value;
  // If no changes were made, return
  if (state.value.previousColumnName === currentColumnName) return;

  // Now it can be assumed that the user entered a column name that was not the previous
  // Get table object id
  const indexTable = findArticleSectionIndex(sectionId);
  // Create array with only column name strings
  const columnNames = articleForForm.value[indexTable].columns.map(({ name }) => name);
  // Check columnNames for duplicate values
  const duplicateColumnNames = containsDuplicateColumnNames(columnNames);

  // If the user entered duplicate column name (one that is already occupied by another column) OR an empty string, then change it back to its provisional name, 'Column-1xyz'
  if (duplicateColumnNames || currentColumnName === '') {
    const provisonalColumnName = createProvisionalColumnName();
    articleForForm.value[indexTable].columns[indexColumn].name = provisonalColumnName;

    // In case of an empty column name
    if (currentColumnName === '') {
      // TODO
      // Show error message to user
      // articleForForm.value[indexTable].columns[indexColumn].errors = {};
      // articleForForm.value[indexTable].columns[indexColumn].errors.missingColumnName = `A column name is required. A provisional name has been set for now. Please change it to your liking or delete the column.`;

      // Clear error message after some time
      // const errorTimeout = setTimeout(() => {
      //     articleForForm.value[indexTable].columns[indexColumn].errors.missingColumnName = '';
      //     clearTimeout(errorTimeout);
      // }, 5000);
    }

    // Select added col name input for user
    selectTableColumnInput(sectionId, indexColumn);
    // Update row objects with provisional name
    updateRowProps(provisonalColumnName, state.value.previousColumnName, indexTable);
    // TODO
    // Update table shrunk object
    // this.handleInputForShrunkSections(sectionId);
    return;
  }

  updateRowProps(currentColumnName, state.value.previousColumnName, indexTable);
  // this.handleInputForShrunkSections(sectionId);
}

/**
 * Returns true or false depending on whether duplicate column names exist
 * @param {array} columnNames An array of string with all existing columns names of a table
 * @returns {boolean} True if duplicate names exist, false if all column names are unique
 */
function containsDuplicateColumnNames(columnNames) {
  return columnNames.some(columnName => {
    // If a columnName is unique the index of its first + last occurence is the same, if not it's a duplicate
    if (columnNames.indexOf(columnName) !== columnNames.lastIndexOf(columnName)) {
        return true;
    }
    return false;
  });
}

/**
 * Adds a row to a table
 * @param {number} sectionId The id of the table section
 */
 function addTableRow(sectionId) {
  // Find index of table section with id
  const indexTable = findArticleSectionIndex(sectionId);
  // Check whether rows array already exists else create it
  if (articleForForm.value[indexTable].rows === undefined) articleForForm.value[indexTable].rows = [];
  // Push new empty object table section with that id (TODO row_id, is necessary?)
  articleForForm.value[indexTable].rows.push({ });
}

/**
 * Removes a row from a table
 * @param {number} sectionId
 * @param {number} indexRow
 */
function deleteTableRow(sectionId, indexRow) {
  // Find index of table section with sectionId
  const indexTable =  findArticleSectionIndex(sectionId);
  // Delete row object in table rows
  articleForForm.value[indexTable].rows.splice(indexRow, 1);
}

/**
 * Updates a certain property of all row objects in the rows array of a table with the changed column name
 * @param {string} newColumnName The new column name
 * @param {string} previousColumnName The previous name that needs to be changed
 * @param {number} indexTable The index of the table in the articlesForForm array
 */
function updateRowProps(newColumnName, previousColumnName, indexTable) {
  // If rows array doesn't exist in table or is empty, return (previousColumnName prop does not exist either)
  if (articleForForm.value[indexTable].rows === undefined || articleForForm.value[indexTable].rows.length === 0) return;

  // If previousColumnName exists in first row of rows array in table, loop through each object and set the contents of previousColumnName to newColumnName + delete previousColumnName
  if (articleForForm.value[indexTable].rows[0][previousColumnName]) {
    articleForForm.value[indexTable].rows.forEach(row => {
      row[newColumnName] = row[previousColumnName];
      delete row[previousColumnName];
    });
  }
}

/**
 * Deletes the properties in all row objects in the rows array of a table when the corresponding column name gets deleted
 * @param {number} indexTable The index of the table in the articlesForForm array
 * @param {string} columnName The name of the column that got deleted
 */
function deleteTableCells(indexTable, columnName) {
  // If rows array doesn't exist in table or is empty, return
  if (articleForForm.value[indexTable].rows === undefined || articleForForm.value[indexTable].rows.length === 0) return;
  // Delete prop that is named after column in every object (row) of rows array
  articleForForm.value[indexTable].rows.forEach(row => {
      delete row[columnName];
  });
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
                  <div v-for="(item, i) in element.items" :key="`${element.name}Items-${element.id}`">
                    <label :for="`${element.name}Items-${element.id}-Item${i}`">{{ i + 1 }}</label>
                    <textarea v-model.trim="item.value" :name="`${element.name}Items-${element.id}-Item${i}`" :id="`${element.name}Items-${element.id}-Item${i}`" cols="30" rows="1"></textarea>
                    <button @click="deleteListArrayItem(element.id, i)" type="button">DEL</button>
                  </div>
                  <button @click="addListArrayItem(element.id)" type="button">+ Item</button>
                </div>
              </fieldset>
            </div>
          </template>

          <!-- TABLE SECTION -->
          <template v-else-if="element.name === 'table'">
            <!-- COLUMNS -->
            <div>
              <fieldset>
                <legend>Columns</legend>
                <div v-if="element.columns">
                  <!-- Loop through columns -->
                  <div v-for="(column, i) in element.columns"
                    :key="`${element.name}Cols-${element.id}`">
                    <label :for="`${element.name}Col${i}-${element.id}`">{{ i + 1 }}</label>
                    <input v-model.trim="column.name" @focus="saveColumnName(column.name)" @blur="handleColumnInput($event, element.id, i)" type="text" :name="`${element.name}Col${i}-${element.id}`" :id="`${element.name}Col${i}-${element.id}`" :placeholder="`Column ${i + 1}`">
                    <button @click="deleteTableColumn(element.id, i)" type="button">DEL</button>
                  </div>
                </div>
                <button @click="addTableColumn(element.id)" type="button" :id="`${element.name}ColumnBtn-${element.id}`">+ Col</button>
              </fieldset>
            </div>

            <!-- ROWS -->
            <div>
              <fieldset>
                <legend>Rows</legend>
                <div v-if="element.rows">
                  <!-- Loop through rows -->
                  <div v-for="(row, i) in element.rows" :key="`${element.name}Rows-${element.id}`">
                    <label>Row {{ i + 1 }}</label>
                    <!-- Loop through cells according to columns -->
                    <div v-for="(cell, j) in element.columns">
                      <label :for="`${element.name}Row${i}-Col${j}-${element.id}`"></label>
                      <input v-model.trim="row[`${element.columns[j].name}`]" type="text" :name="`${element.name}Row${i}-Col${j}-${element.id}`" :id="`${element.name}Row${i}-Col${j}-${element.id}`" :placeholder="element.columns[j].name">
                    </div>
                    <button @click="deleteTableRow(element.id, i)" type="button">DEL</button>
                  </div>
                </div>
                <button @click="addTableRow(element.id)" type="button">+ Row</button>
              </fieldset>
            </div>
          </template>

          <!-- HEADING / PARAGRAPH / SUBHEADING / SUMMARY SECTION -->
          <template v-else>
            <div>
              <label :for="`${element.name}Content-${element.id}`">Content</label>
              <textarea v-model.trim="element.value" :name="`${element.name}Content-${element.id}`" :id="`${element.name}Content-${element.id}`" cols="30" rows="2"></textarea>
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
