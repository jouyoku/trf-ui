import {
  ref,
  computed,
  watch
} from '@vue/composition-api';
import {
  url as gqlFormsUrl,
  query as gqlFormsQuery,
} from "./graphqlForms.js";
import gql from 'graphql-tag'
import {getApolloClient} from "./utils.js"

export function Forms() {
  const _client = getApolloClient(gqlFormsUrl);
  const forms = ref([]);
  const formNames = computed(() => {
    const tmp = [];
    for (const key in forms.value) {
      tmp.push(forms.value[key].name);
    }
    return tmp;
  });

  _client.query({
    query: gql( gqlFormsQuery.forms)
  }).then((result) => {
    //console.log(result)
    forms.value = result.data.forms;
  }, (error) => {
    console.log(error)
  });

  return {
    forms,
    formNames,
    //forms2,
  };
}
