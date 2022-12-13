<script setup>
const props = defineProps({
  compProps: Object
});
</script>

<template>
    <div class="table-container">
        <table class="table">
            <thead class="table-head">
                <tr class="table-head-row">
                    <td
                        v-for="(columnName, k) in props.compProps.table_head" :key="k" class="table-head-cell">{{ columnName }}</td>
                </tr>
            </thead>
            <tbody class="table-body">
                <tr
                    v-for="(row, l) in props.compProps.rows"
                    :key="l"
                    class="table-body-row">
                    <td
                        v-for="(cell, m) in row" 
                        :key="m"
                        class="table-body-cell">
                        {{ cell }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>