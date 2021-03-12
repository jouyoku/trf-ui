<template lang="pug">
.list
  b-row
    b-col(md='6')
      b-input-group(size='sm')
        b-input-group-prepend(is-text) Form
        b-form-select(v-model="form", :options="formNames")
    //b-col.my-1(md='6')
      b-input-group(size='sm')
        b-input-group-prepend
          b-button.mr-1(v-if="searchMode", @click="searchStop()") Back
          b-button(@click="searchStart()") Search
        b-form-input(type="text", v-model="searchString")
  FormRecords(:form="form", button-edit-record, button-delete-record)
  //| {{records}}
</template>
<script>
import { useStore } from "vuex";
import { ref } from "@vue/composition-api";
import FormRecords from "@/components/FormRecords.vue"; // @ is an alias to /src
import * as gql from "@/components/lib/js/GraphQL.js";

export default {
  props: {},
  components: {
    FormRecords,
  },
  setup(props, context) {
    console.log(context, useStore);
    //const _store = useStore();

    const forms = ref([]);
    const formNames = ref([]);
    const form = ref("");
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

    return {
      forms,
      form,
      formNames,
      //search,
    };
  },
};
</script>
