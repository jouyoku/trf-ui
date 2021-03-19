<template lang="pug">
.list
  b-row
    b-col(md='6')
      b-input-group(size='sm')
        b-input-group-prepend(is-text) Form
        b-form-select(v-model="form", :options="formNames" @change="onFormChange")
    b-col(md='6')
      b-input-group(size='sm')
        b-input-group-prepend
          b-button.mr-1(v-show="searchMode", @click="searchStop()") Back
          b-button(@click="searchStart()") Search
        b-form-input(type="text", v-model="searchString")
  FormRecords#page-list(v-show="!searchMode", :form="form", button-edit-record, button-delete-record)
  FormSearch#page-list(v-show="searchMode", :form="searchForm", :search="search", button-edit-record, button-delete-record)
  //| {{records}}
</template>
<script>
//import { useStore } from "vuex";
import { ref, watch } from "@vue/composition-api";
import FormRecords from "@/components/FormRecords.vue"; // @ is an alias to /src
import FormSearch from "@/components/FormSearch.vue"; // @ is an alias to /src
import * as gql from "@/components/lib/js/GraphQL.js";

export default {
  props: {},
  components: {
    FormRecords,
    FormSearch,
  },
  setup(props, context) {
    //const _store = context.root.$store;
    //console.log(context, _store.state);
    //const _store = useStore();
    const _id = "List__";

    const forms = ref([]);
    const formNames = ref([]);
    //const form = ref(_store.state.form2);
    const form = ref("");
    if (localStorage.getItem(_id + "form")) {
      form.value = localStorage.getItem(_id + "form");
    }

    const searchForm = ref("");
    const searchMode = ref(false);
    if (localStorage.getItem(_id + "searchMode")) {
      searchMode.value = localStorage.getItem(_id + "searchMode") == "true";
    }
    const searchString = ref("");
    const search = ref("");
    if (localStorage.getItem(_id + "search")) {
      searchString.value = localStorage.getItem(_id + "search");
    }

    if (searchMode.value && form.value != "" && searchString.value != "") {
      searchForm.value = form.value;
      search.value = searchString.value;
    }

    const searchStart = () => {
      searchMode.value = true;
      localStorage.setItem(_id + "searchMode", searchMode.value);
      search.value = "";
      searchForm.value = form.value;
      search.value = searchString.value;
      localStorage.setItem(_id + "search", search.value);
    };
    const searchStop = () => {
      searchMode.value = false;
      localStorage.setItem(_id + "searchMode", searchMode.value);
    };

    gql.getForms().then(
      (r) => {
        forms.value = r;
        formNames.value = gql.getFormNames(forms.value);
      },
      (e) => {
        console.error(e);
      }
    );

    const onFormChange = (value) => {
      localStorage.setItem(_id + "form", value);
    };

    return {
      forms,
      form,
      formNames,
      onFormChange,
      searchForm,
      searchMode,
      searchString,
      search,
      searchStart,
      searchStop,
    };
  },
};
</script>
