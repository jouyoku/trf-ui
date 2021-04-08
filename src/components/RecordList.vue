<template lang="pug">
.list
	b-row(v-if="records.length > perPage", size='sm')
		b-col(md='6')
			b-input-group(size='sm')
				b-input-group-prepend(is-text) {{ $t('頁次') }}
				b-form-input(v-model="currentPage")
		b-col(md='6')
			b-pagination(size="sm", :total-rows="records.length", v-model="_currentPage", :per-page="perPage", align="fill", :limit="paginationLimit", first-number, last-number)
	b-table(foot-clone, responsive='true', small, striped, sort-by="_id", sort-desc, :items="records", :fields="fields", :per-page="perPage", :current-page="_currentPage", :sticky-header="stickyHeaders == null ? false : stickyHeaders")
		template(v-slot:cell(_actions)="row")
			b-button.m-1(v-if="editClick !== null", size='sm', @click='editClick(row.item._id)')
				| {{ $t('編輯') }}
			b-button.m-1(v-if="deleteClick !== null", size='sm', @click='deleteClick(row.item._id)')
				| {{ $t('刪除') }}
</template>
<script>
import { ref, watch } from "@vue/composition-api";

export default {
  props: {
    records: {
      type: Array,
      default: () => {
        return [];
      },
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    perPage: {
      type: Number,
      default: 15,
    },
    paginationLimit: {
      type: Number,
      default: 5,
    },
    editClick: {
      type: Function,
      default: null,
    },
    deleteClick: {
      type: Function,
      default: null,
    },
    fields: {
      type: Array,
      default: () => {
        return [];
      },
    },
    stickyHeaders: {
      type: String,
      default: null,
    },
  },
  setup(props, context) {
    const _currentPage = ref(props.currentPage);

    watch(_currentPage, (val, oldVal) => {
      context.emit("currentPageChanged", _currentPage.value);
    });

    return {
      _currentPage,
    };
  },
};
</script>
