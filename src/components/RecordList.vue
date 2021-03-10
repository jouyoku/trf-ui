<template lang="pug">
include lib/pug/Table.pug

div
  +table
    template(v-slot:cell(actions)="row")
      b-button.m-1(size='sm', :href="'/msbt_admin/cid.record.edit?name=' + name0 + '&id=' + row.item._id", target="_blank")
        | 編輯
      b-button.m-1(size='sm', @click='deleteRecord(row.item._id)')
        | 刪除
</template>
<script>
import {
  ref,
  watch,
  toRefs,
} from '@vue/composition-api';
export default {
  name: "RecordList",
  props: {
    records: {
      type: Array,
      default: () => {
        return [];
      },
    },
    fields: {
      type: Array,
      default: () => {
        return [];
      },
    },
    currentPage0: {
      type: Number,
      default: 1,
    },
  },
  setup(props, context) {
    const currentPage = ref(props.currentPage0);

    watch(currentPage, (newVal, oldVal) => {
      context.emit("currentPageChanged", newVal)
    })

    return {
      currentPage,
    }
  },
};
</script>
