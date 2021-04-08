<template lang="pug">
.list
  b-row
    b-col(md='6')
      b-input-group(size='sm')
        b-input-group-prepend(is-text) {{ $t('表單') }}
        b-form-select(v-model="form", :options="formNames" @change="onFormChange")
  FormRecords#page-list(:form="form", button-edit-record, button-delete-record)
</template>
<script>
import { ref, watch } from "@vue/composition-api";
import FormRecords from "@/components/FormRecords.vue"; // @ is an alias to /src
import * as gql from "@/components/lib/js/GraphQL.js";

export default {
  props: {},
  components: {
    FormRecords,
  },
  setup(props, context) {
    const _id = "List__";

    const forms = ref([]);
    const formNames = ref([]);
    const form = ref("");
    if (localStorage.getItem(_id + "form")) {
      form.value = localStorage.getItem(_id + "form");
    }

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
    };
  },
};
</script>
