<i18n src="./i18n/FormSearch.json">
</i18n>
<template lang="pug">
.list
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
    search: {
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
  /*
  data() {
    this.$i18n.locale = "en";
    return { locale: "en" };
  },
  watch: {
    locale(val) {
      this.$i18n.locale = val;
    },
  },
  mounted: function () {
    console.log(this.$i18n.setLocaleMessage);
    this.$i18n.locale = "zh";
  },
*/
  setup(props, context) {
    //console.log(context);
    const _id = "FormSearch__" + context.attrs.id + "__";

    const {
      form,
      search,
      perPage,
      buttonEditRecord,
      buttonDeleteRecord,
      hiddenFields,
    } = toRefs(props);

    const currentPage = ref(1);
    if (localStorage.getItem(_id + "currentPage")) {
      currentPage.value = localStorage.getItem(_id + "currentPage");
    }
    const formFields = ref([]);
    const formFieldNames = ref([]);
    const records = ref([]);

    const fetchPage = async (page) => {
      //console.log(page);
      page++;
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

    const onFormSearch = async (form, search) => {
      if (form === "" || search === "") {
        records.value = [];
        return;
      }

      await gql.getFormFields(form).then(
        (r) => {
          formFields.value = r.fields;
          formFieldNames.value = gql.formFieldNames(formFields.value);
        },
        (e) => {
          console.error(e);
        }
      );

      await gql.formSearch(form, formFieldNames.value, search).then(
        (r) => {
          records.value = r;
        },
        (e) => {
          console.error(e);
        }
      );

      fetchPage(currentPage.value);
    };

    onFormSearch(form.value, search.value);

    watch(
      form,
      async (newVal, oldVal) => {
        onFormSearch(newVal, search.value);
      },
      {
        deep: true,
        sync: true,
      }
    );

    watch(
      search,
      async (newVal, oldVal) => {
        onFormSearch(form.value, newVal);
      },
      {
        deep: true,
        sync: true,
      }
    );

    watch(currentPage, (newVal, oldVal) => {
      localStorage.setItem(_id + "currentPage", newVal);
      fetchPage(newVal);
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

      for (const key in records.value) {
        if (records.value[key]._id === id) {
          records.value.splice(key, 1);
        }
      }

      fetchPage(currentPage.value);
    };

    return {
      currentPage,
      formFields,
      records,
      formHeaderFields,
      editRecordUrl,
      deleteRecord,
    };
  },
};
</script>
