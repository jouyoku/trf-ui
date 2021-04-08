<template lang="pug">
.list
  b-row
    b-col(md='6')
      b-input-group(size='sm')
        b-input-group-prepend
          b-button.mr-1(v-show="searchMode", @click="searchStop()") {{ $t('結束') }}
          b-button(@click="searchStart()") {{ $t('搜尋') }}
        b-form-input(type="text", v-model="searchString")
  b-row(v-if="records.length > perPage", size='sm')
    b-col(md='6')
      b-input-group(size='sm')
        b-input-group-prepend(is-text) {{ $t('頁次') }}
        b-form-input(v-model="currentPage")
    b-col(md='6')
      b-pagination(size="sm", :total-rows="records.length", v-model="currentPage", :per-page="perPage", align="fill", :limit="paginationLimit", first-number, last-number)
  b-table(foot-clone, responsive='true', small, striped, sort-by="_id", sort-desc, :items="records", :fields="formHeaderFields", :per-page="perPage", :current-page="currentPage")
    template(v-slot:cell(_actions)="row")
      b-button.m-1(v-if="buttonEditRecord", size='sm', :href='editRecordUrl(row.item._id)')
        | {{ $t('編輯') }}
      b-button.m-1(v-if="buttonDeleteRecord", size='sm', @click='deleteRecord(row.item._id)')
        | {{ $t('刪除') }}
</template>
<script>
import { ref, watch, set, toRefs, computed } from "@vue/composition-api";
import * as gql from "@/components/lib/js/GraphQL.js";

export default {
  props: {
    form: {
      type: String,
      default: "",
    },
    perPage: {
      type: Number,
      default: 15,
    },
    paginationLimit: {
      type: Number,
      default: 5,
    },
    buttonEditRecord: {
      type: Boolean,
      default: false,
    },
    buttonDeleteRecord: {
      type: Boolean,
      default: false,
    },
    hiddenFields: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props, context) {
    const _id = "FormRecords__" + context.attrs.id + "__";

    const {
      form,
      perPage,
      buttonEditRecord,
      buttonDeleteRecord,
      hiddenFields,
    } = toRefs(props);

    const allCurrentPage = ref(1);
    if (localStorage.getItem(_id + "allCurrentPage")) {
      allCurrentPage.value = localStorage.getItem(_id + "allCurrentPage");
    }
    const formFields = ref([]);
    const formFieldNames = ref([]);
    const allRecords = ref([]);

    const searchCurrentPage = ref(1);
    if (localStorage.getItem(_id + "searchCurrentPage")) {
      searchCurrentPage.value = localStorage.getItem(_id + "searchCurrentPage");
    }
    const searchRecords = ref([]);
    const searchMode = ref(false);
    if (localStorage.getItem(_id + "searchMode")) {
      searchMode.value = localStorage.getItem(_id + "searchMode") == "true";
    }
    const searchString = ref("");
    if (localStorage.getItem(_id + "searchString")) {
      searchString.value = localStorage.getItem(_id + "searchString");
    }

    const currentPage = computed({
      get: () => {
        return searchMode.value
          ? searchCurrentPage.value
          : allCurrentPage.value;
      },
      set: (val) => {
        if (searchMode.value) {
          searchCurrentPage.value = val;
        } else {
          allCurrentPage.value = val;
        }
      },
    });

    const records = computed(() => {
      return searchMode.value ? searchRecords.value : allRecords.value;
    });

    const search = async (str) => {
      if (str === "") {
        searchRecords.value = [];
        return;
      }

      await gql.formSearch(form.value, formFieldNames.value, str).then(
        (r) => {
          searchRecords.value = r;
        },
        (e) => {
          console.error(e);
        }
      );
    };

    const searchStart = () => {
      searchMode.value = true;
      localStorage.setItem(_id + "searchMode", searchMode.value);
      localStorage.setItem(_id + "searchString", searchString.value);
      search(searchString.value);
    };
    const searchStop = () => {
      searchMode.value = false;
      localStorage.setItem(_id + "searchMode", searchMode.value);
    };

    const fetchPage = async (page) => {
      if (formFields.value.length <= 0) {
        return;
      }

      let fromId = allRecords.value.length - page * perPage.value;
      let count = perPage.value;
      if (fromId < 0) {
        count = count + fromId;
        fromId = 0;
      }
      for (let i = count - 1; i >= 0; i--) {
        if (!allRecords.value[fromId + i][formFields.value[0].name]) {
          break;
        }
        count--;
      }
      await gql
        .getFormRecords(form.value, formFieldNames.value, fromId, count)
        .then(
          (r) => {
            for (let i = 0; i < r.length; i++) {
              if (allRecords.value[fromId + i]._id !== r[i]._id) {
                continue;
              }
              set(allRecords.value, fromId + i, r[i]);
              continue;
            }
          },
          (e) => {
            console.error(e);
          }
        );
    };

    const formHeaderFields = computed(() => {
      const tmp = [];
      if (!hiddenFields.value.includes("_id")) {
        tmp.push({
          key: "_id",
          label: "ID",
        });
      }

      if (buttonEditRecord.value || buttonDeleteRecord.value) {
        tmp.unshift({
          key: "_actions",
          label: "",
        });
      }
      for (const field of formFields.value) {
        if (hiddenFields.value.includes(field.name)) {
          continue;
        }
        tmp.push({
          key: field.name,
          label: field.comment,
        });
      }
      return tmp;
    });

    const onFormChange = async (newVal) => {
      await gql.getFormFields(newVal).then(
        (r) => {
          formFields.value = r.fields;
          formFieldNames.value = gql.formFieldNames(formFields.value);
        },
        (e) => {
          console.error(e);
        }
      );

      await gql.getFormRecordsId(newVal).then(
        (r) => {
          allRecords.value = r;
        },
        (e) => {
          console.error(e);
        }
      );

      fetchPage(allCurrentPage.value);

      if (searchMode.value) {
        await search(searchString.value);
      }
    };

    if (form.value != "") {
      onFormChange(form.value);
    }

    watch(
      form,
      async (newVal, oldVal) => {
        if (newVal === "") {
          return;
        }
        onFormChange(newVal);
      },
      {
        deep: true,
        sync: true,
      }
    );

    watch(allCurrentPage, (newVal, oldVal) => {
      localStorage.setItem(_id + "allCurrentPage", newVal);
      fetchPage(newVal);
    });

    watch(searchCurrentPage, (newVal, oldVal) => {
      localStorage.setItem(_id + "searchCurrentPage", newVal);
    });

    const editRecordUrl = (id) => {
      return process.env.VUE_APP_editRecordUrl.replace(
        "__FORM__",
        form.value
      ).replace("__ID__", id);
    };

    const deleteRecord = async (id) => {
      if (!(await context.root.$bvModal.msgBoxConfirm("確定刪除資料？"))) {
        return;
      }

      if (!(await gql.deleteRecord(form.value, id))) {
        context.root.$bvModal.msgBoxOk("刪除資料失敗！");
        return;
      }

      for (const key in allRecords.value) {
        if (allRecords.value[key]._id === id) {
          allRecords.value.splice(key, 1);
        }
      }

      fetchPage(allCurrentPage.value);
    };

    return {
      currentPage,
      formFields,
      records,
      formHeaderFields,
      editRecordUrl,
      deleteRecord,
      searchMode,
      searchString,
      searchStart,
      searchStop,
    };
  },
};
</script>
