<i18n>
  {
    "en-US": {
      "表單": "Form",
      "結束": "Back",
      "搜尋": "Search"
    },
    "zh-TW": {
      "表單": "表單",
      "結束": "結束",
      "搜尋": "搜尋"
    }
  }
</i18n>
<template lang="pug">
.setup
  //| {{$route.params}}
  //b-row(v-if="!$route.params.form")
  b-row
    b-col(md='6')
      b-input-group(size='sm')
        b-input-group-prepend(is-text) {{ $t('表單') }}
        b-form-select(v-model="form", :options="formNames" @change="onFormChange")
  FormFields#page-setup(:form="form")
</template>
<script>
import { ref, watch } from "@vue/composition-api";
import FormFields from "@/components/FormFields.vue";
import * as gql from "@/components/lib/js/GraphQL.js";

export default {
  props: {},
  components: {
    FormFields,
  },
  setup(props, context) {
    //const _store = context.root.$route;
    //console.log(context, _store);
    //const _store = useStore();
    const _id = "Setup__";

    const forms = ref([]);
    const formNames = ref([]);
    const form = ref("");

    gql.getForms().then(
      (r) => {
        forms.value = r;
        formNames.value = gql.getFormNames(forms.value);
        if (formNames.value.includes(context.root.$route.params.form)) {
          form.value = context.root.$route.params.form;
        } else {
          if (context.root.$route.params.form !== undefined) {
            context.root.$router.replace(
              "/" + context.root.$route.params.locale + "/setup"
            );
          }
        }
      },
      (e) => {
        console.error(e);
      }
    );

    const onFormChange = (value) => {
      context.root.$router.replace(
        "/" + context.root.$route.params.locale + "/setup/" + value
      );
    };

    return {
      //forms,
      form,
      formNames,
      onFormChange,
    };
  },
};
</script>
