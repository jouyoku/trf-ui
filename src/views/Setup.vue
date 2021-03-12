<template lang="pug">
.list
  b-row(size='sm')
    b-col(md='6')
      b-input-group(size='sm')
        b-input-group-prepend(is-text) Form
        b-form-select(v-model="form", :options="formNames")
  FormFields(:form="form", button-edit-record, button-delete-record)
  //| {{records}}
</template>
<script>
import { ref } from "@vue/composition-api";
import FormFields from "@/components/FormFields.vue"; // @ is an alias to /src
import * as gql from "@/components/lib/js/GraphQL.js";

export default {
  props: {},
  components: {
    FormFields,
  },
  setup(props, context) {
    const forms = ref([]);
    const formNames = ref([]);
    const form = ref("");

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
    };
  },
};
</script>
