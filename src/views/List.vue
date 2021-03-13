<template lang="pug">
.list
  b-row
    b-col(md='6')
      b-input-group(size='sm')
        b-input-group-prepend(is-text) Form
        b-form-select(v-model="form", :options="formNames" @change="onFormChange")
    //b-col.my-1(md='6')
      b-input-group(size='sm')
        b-input-group-prepend
          b-button.mr-1(v-if="searchMode", @click="searchStop()") Back
          b-button(@click="searchStart()") Search
        b-form-input(type="text", v-model="searchString")
  FormRecords#page-list(:form="form", button-edit-record, button-delete-record)
  //| {{records}}
</template>
<script>
//import { useStore } from "vuex";
import { ref, watch } from "@vue/composition-api";
import FormRecords from "@/components/FormRecords.vue"; // @ is an alias to /src
import * as gql from "@/components/lib/js/GraphQL.js";

export default {
  props: {},
  components: {
    FormRecords,
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
    //const search = ref("");

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
    /*
    watch(
      form,
      async (newVal, oldVal) => {
        //_store.commit("setForm2", newVal);
        console.log(newVal, _store.state.form2);
      },
      {
        deep: true,
        sync: true,
      }
    );
//*/
    return {
      forms,
      form,
      formNames,
      //search,
      onFormChange,
    };
  },
};
</script>
