<template lang="pug">
.list
  b-row
    b-col(md='6', v-show="useMode !== 'settings'")
      b-input-group(size='sm')
        b-input-group-prepend
          b-button.mr-1(v-show="useMode === 'search'", @click="searchStop()") {{ $t('結束') }}
          b-button(@click="searchStart()") {{ $t('搜尋') }}
        b-form-input(type="text", v-model="searchString")
    b-col(md='6', v-show="useMode !== 'settings'")
      b-input-group(size='sm')
        b-input-group-prepend
          b-button.mr-1(size='sm', @click="settings()") {{ $t('設定') }}
    b-col(md='6', v-show="useMode === 'settings'")
      b-input-group(size='sm')
        b-input-group-prepend
          b-button.mr-1(size='sm', @click="settingsExit()") {{ $t('離開設定') }}
          b-button.mr-1(size='sm', @click="settingsSave()") {{ $t('儲存設定') }}
          b-button.mr-1(size='sm', @click="settingsSaveLocal()") {{ $t('儲存為個人設定') }}
  b-row(v-show="(useMode === 'all' || useMode === 'search') && records.length > perPage", size='sm')
    b-col(md='6')
      b-input-group(size='sm')
        b-input-group-prepend(is-text) {{ $t('頁次') }}
        b-form-input(v-model="currentPage")
    b-col(md='6')
      b-pagination(size="sm", :total-rows="records.length", v-model="currentPage", :per-page="perPage", align="fill", :limit="paginationLimit", first-number, last-number)
  b-table(v-show="useMode === 'all' || useMode === 'search'", foot-clone, responsive='true', small, striped, sort-by="_id", sort-desc, :items="records", :fields="formHeaderFields", :per-page="perPage", :current-page="currentPage", :sticky-header="stickyHeaders === null ? false : stickyHeaders")
    template(v-slot:cell(_actions)="row")
      b-button.m-1(v-show="buttonEditRecord", size='sm', :href='editRecordUrl(row.item._id)')
        | {{ $t('編輯') }}
      b-button.m-1(v-show="buttonDeleteRecord", size='sm', @click='deleteRecord(row.item._id)')
        | {{ $t('刪除') }}
  table.table.table-striped(v-show="useMode === 'settings'")
    thead.thead-dark
      tr
        th(scope='col')
          b-form-checkbox(@change="toggleAllHidden") {{ $t('隱藏') }}
        th(scope='col') {{ $t('類型') }}
        th(scope='col') {{ $t('名稱') }}
        th(scope='col') {{ $t('說明') }}
    tbody
      tr(v-for='(item, key) in formFields')
        //, :style!="{'background-color': key == " + fieldsDND + ".current.value ? 'gold' : 'white'}")&attributes(dndAttributes(fieldsDND))
        td
          b-form-checkbox(v-model="item.hidden", @change="toggleHidden(key, item.hidden)")
        td {{ item.type }}
        td {{ item.name }}
        td {{ $t(item.comment) }}

</template>
<script>
import { ref, watch, set, toRefs, computed } from "@vue/composition-api";
import * as gql from "@/components/lib/js/GraphQL.js";
import _ from "lodash";

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
    stickyHeaders: {
      type: String,
      default: null,
    },
  },
  setup(props, context) {
    const _id = "FormRecords__" + context.attrs.id + "__";
    const _bvModal = context.root.$bvModal;
    const _i18n = context.root.$i18n;

    const { form, perPage, buttonEditRecord, buttonDeleteRecord } = toRefs(
      props
    );

    const allCurrentPage = ref(1);
    if (localStorage.getItem(_id + "allCurrentPage")) {
      allCurrentPage.value = localStorage.getItem(_id + "allCurrentPage");
    }
    const formFields0 = ref([]);
    const formFields = ref([]);
    const formFieldNames = ref([]);
    const allRecords = ref([]);

    const searchCurrentPage = ref(1);
    if (localStorage.getItem(_id + "searchCurrentPage")) {
      searchCurrentPage.value = localStorage.getItem(_id + "searchCurrentPage");
    }
    const searchRecords = ref([]);
    const useMode = ref("all");
    if (localStorage.getItem(_id + "useMode")) {
      useMode.value = localStorage.getItem(_id + "useMode");
    }
    const searchString = ref("");
    if (localStorage.getItem(_id + "searchString")) {
      searchString.value = localStorage.getItem(_id + "searchString");
    }

    const currentPage = computed({
      get: () => {
        return useMode.value === "search"
          ? searchCurrentPage.value
          : allCurrentPage.value;
      },
      set: (val) => {
        if (useMode.value === "search") {
          searchCurrentPage.value = val;
        } else {
          allCurrentPage.value = val;
        }
      },
    });

    const records = computed(() => {
      return useMode.value === "search"
        ? searchRecords.value
        : allRecords.value;
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
      useMode.value = "search";
      localStorage.setItem(_id + "useMode", useMode.value);
      localStorage.setItem(_id + "searchString", searchString.value);
      search(searchString.value);
    };
    const searchStop = () => {
      useMode.value = "all";
      localStorage.setItem(_id + "useMode", useMode.value);
    };

    const settings = () => {
      useMode.value = "settings";
    };
    const settingsExit = () => {
      useMode.value = "all";
      if (localStorage.getItem(_id + "useMode")) {
        useMode.value = localStorage.getItem(_id + "useMode");
      }
      useMode.value = "all";
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
      const tmp = [
        {
          key: "_id",
          label: "ID",
        },
      ];

      if (buttonEditRecord.value || buttonDeleteRecord.value) {
        tmp.unshift({
          key: "_actions",
          label: "",
        });
      }
      for (const field of formFields.value) {
        if (field.hidden) {
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
          formFields0.value = _.cloneDeep(r.fields);
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

      if (useMode.value === "search") {
        await search(searchString.value);
      }
    };

    if (form.value !== "") {
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
      if (!(await _bvModal.msgBoxConfirm(_i18n.t("確定刪除資料？")))) {
        return;
      }

      if (!(await gql.deleteRecord(form.value, id))) {
        _bvModal.msgBoxOk(_i18n.t("刪除資料失敗！"));
        return;
      }

      for (const key in allRecords.value) {
        if (allRecords.value[key]._id === id) {
          allRecords.value.splice(key, 1);
        }
      }

      fetchPage(allCurrentPage.value);
    };

    const toggleAllHidden = (checked) => {
      //var indexes = [];
      //var names = [];
      for (let i = 0; i < formFields.value.length; i++) {
        if (formFields.value[i]["hidden"] != checked) {
          //indexes.push(i);
          //names.push(formFields.value[i].name);
          formFields.value[i]["hidden"] = checked;
        }
      }
      //this.undones.length = 0;
      /*
      this.actions.push({
        type: "changeFieldHidden",
        indexes: indexes,
        names: names,
        value: checked,
      });
      */
    };

    const toggleHidden = (key, checked) => {
      /*
      this.undones.length = 0;
      this.actions.push({
        type: "changeFieldHidden",
        indexes: [key],
        names: [formFields.value[key].name],
        value: checked,
      });
      */
    };

    const settingsSave = async () => {
      for (let i = 0; i < formFields0.value.length; i++) {
        if (_.isEqual(formFields0.value[i], formFields.value[i])) {
          continue;
        }
        if (
          !(await gql.modifyField(
            form.value,
            formFields.value[i].name,
            formFields.value[i]
          ))
        ) {
          _bvModal.msgBoxOk(_i18n.t("儲存資料失敗！"));
          return;
        }
      }
    };

    const settingsSaveLocal = () => {
      console.log("sl");
    };

    return {
      currentPage,
      formFields,
      records,
      formHeaderFields,
      editRecordUrl,
      deleteRecord,
      useMode,
      searchString,
      searchStart,
      searchStop,
      settings,
      settingsExit,
      toggleAllHidden,
      toggleHidden,
      settingsSave,
      settingsSaveLocal,
    };
  },
};
</script>
