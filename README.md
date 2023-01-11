# Draggable Article Project

## Description
This project shows how to utilize the [Vue 3 variant](https://github.com/SortableJS/vue.draggable.next) of the [SortableJS](https://github.com/SortableJS/Sortable) package to create articles whose sections are movable while still being in the process of creation.

[Try it out!](https://codesandbox.io/s/article-creation-with-draggable-zn9i11?file=/src/components/ArticleForm.vue)

## Key Feature
The article creation starts off with a basic template containing a heading, summary and paragraph. The user is able to add sections via an add-button and a select-dropdown.

The key feature of this project is the possibility of rearranging the order of the article using the Vue Draggable package mentioned above.

## More Features by Type of Section
Some sections have particular features on their own.

### Possible Types of Article Sections
Article sections are limited to the following types:
- Heading
- Image
- List
- Paragraph
- Subheading
- Summary (Introduction)
- Table

### Image
Once selected via the `input type="file"` the chosen image is previewed for the user in the form itself.

Furthermore an image can made the title image of the article. Selecting an image as title image will deactivate this option on other images in the article (both existing ones as well as images that are added afterwards). A title image will always be displayed at the top of an article, independent of its actual position.

### List
Once a section has been made a list items can be added to it. So far the list is an unordered list. The items that can be added are of `input type="text"`.

### Table
Once a section has been made a table columns and rows can be added to it.

Since a column cannot exist without a name, each column is assigned random string as name on creation. Of course each column can be re-named by the user. The maximum amount of columns per table is limited to four.

Each row that is added to a table will have the same amount of cells as existing table columns. Content can be added to the cells via an `input type="text"`.

A deleted row will have no effect on the table. A deleted column instead will delete all cells that are connected to it.

### Heading, Paragraph, Subheading, Summary
These section types don't have any particular features on their own and contain mainly one `input type="text"`.

### Article Preview
Depending on the breakpoint a preview of the current state of the article will be displayed either below the article form or next to it on the right side.

## Live Demo
Since this project is part of the [Trainer Codes Project](https://github.com/Grischa89/tc_vue_1) this repository is trying to display the draggable article functionality on its own.

Codesandbox is used as a [live demo](https://codesandbox.io/s/article-creation-with-draggable-zn9i11?file=/src/components/ArticleForm.vue).

## Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
