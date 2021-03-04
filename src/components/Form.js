//const { ref, computed, watch } = 'vue';
import { ref, computed, watch } from '@vue/composition-api';
import axios from 'axios'
import {
  url as gqlFormUrl,
  query as gqlFormQuery,
} from "./graphqlForm.js";

export function Form(formName) {
  const form = ref(formName);
  const formFields = ref([]);
  const formField = ref("");

  const formFieldNames = computed(() => {
    const tmp = ["_id"];
    for (const key in formFields.value) {
      tmp.push(formFields.value[key].name);
    }
    return tmp;
  });
/*
  const formHeaderFields = computed(() => {
    const tmp = [{ key: "_id", label: "ID", sortable: true }];
    for (const field of formFields.value) {
      if (field.hidden) {
        //continue;
      }
      tmp.push({ key: field.name, label: field.comment, sortable: true });
    }
    return tmp;
  });
*/
  watch(
    form,
    (newVal, oldVal) => {
      if (newVal == "") {
        return;
      }

      axios
        .post(gqlFormUrl + "?name=" + form.value, {
          query: gqlFormQuery.fields,
        })
        .then(
          (result) => {
            //console.log("result", result);
            formFields.value = result["data"]["data"]["fields"];
            for (const key in formFields.value) {
              formFields.value[key].attributes = JSON.parse(
                formFields.value[key].attributes
              );
            }
          },
          (error) => {
            //console.log("error", error);
            this.$message({
              type: "info",
              message: "Send mail failed...",
            });
          }
        );
    },
    {
      sync: true,
    }
  );

  return {
    form,
    formFields,
    formField,
    formFieldNames,
    //formHeaderFields,
  };
}
