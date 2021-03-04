import { ref, computed, watch } from '@vue/composition-api';
import axios from 'axios'
import {
  url as gqlFormsUrl,
  query as gqlFormsQuery,
} from "./graphqlForms.js";

export function Forms() {
  const forms = ref([]);
  const formNames = computed(() => {
    const tmp = [];
    for (const key in forms.value) {
      tmp.push(forms.value[key].name);
    }
    return tmp;
  });

  axios
    .post(gqlFormsUrl, {
      query: gqlFormsQuery.forms,
    })
    .then(
      (result) => {
        //console.log("result", result);
        forms.value = result["data"]["data"]["forms"];
      },
      (error) => {
        //console.log("error", error);
        this.$message({
          type: "info",
          message: "Send mail failed...",
        });
      }
    );

  return {
    forms,
    formNames,
  };
}
