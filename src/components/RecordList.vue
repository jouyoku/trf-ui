<template lang="pug">
div
  b-pagination(size="sm", :total-rows="records.length", v-model="currentPage", :per-page="15", align="fill", limit="10")
  b-table(show-empty='', responsive='true', small, striped, sort-by="_id", sort-desc, :items="records", :fields="fields", per-page="15", :current-page="currentPage")
    template(v-slot:cell(actions)="row")
      b-button.m-1(size='sm', :href="'/msbt_admin/cid.record.edit?name=' + name0 + '&id=' + row.item._id", target="_blank")
        | 編輯
      b-button.m-1(size='sm', @click='deleteRecord(row.item._id)')
        | 刪除
  //, :fields!=fields, :current-page!=table+'.currentPage.value', :per-page!=table+'.perPage.value', :filter!=table+'.filter.value', :sort-by.sync!=table+'.sortBy.value', :sort-desc.sync!=table+'.sortDesc.value', :sort-direction!=table+'.sortDirection.value', @filtered!=table+'.onFiltered')
</template>
<script>
import {
  ref,
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

    return {
      currentPage,
    }
  },
  watch: {
    records: {
      handler: function (val, oldVal) {
        //console.log(val);
        this.currentPage = this.currentPage0;
      },
      deep: true,
      sync: true,
    },
  }
};
</script>
