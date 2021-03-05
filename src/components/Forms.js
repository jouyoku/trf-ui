import {
  ref,
  computed,
  watch
} from '@vue/composition-api';
import axios from 'axios'
import {
  url as gqlFormsUrl,
  query as gqlFormsQuery,
} from "./graphqlForms.js";
import {
  useQuery,
  useResult
} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {
  ApolloClient
} from 'apollo-client'
import {
  HttpLink
} from 'apollo-link-http'
import {
  onError
} from "apollo-link-error"
import {
  InMemoryCache
} from 'apollo-cache-inmemory'

export async function getForms() {
  return await axios.post(gqlFormsUrl, {
    query: gqlFormsQuery.forms,
  });
}
/*
export async function getForms2() {
  await axios.post(gqlFormsUrl, {
    query: gqlFormsQuery.forms,
  }).then((result) => {
    console.log("result", result);
    if (result.data.data) {
      return result.data.data.forms;
    }
    return false;
    //forms.value = result;//["data"]["data"]["forms"];
  }, (error) => {
    console.log('error', error)
  });
}
*/
export async function _gql(uri, gql) {
  const httpLink = new HttpLink({
    //uri: process.env.VUE_APP_GRAPHQL_ENDPOINT
    //uri: 'http://localhost:8080/msbt_admin/cid/api/forms.php'
    uri: uri
  })

  // Error Handling
  const errorLink = onError(({
    graphQLErrors,
    networkError
  }) => {
    if (graphQLErrors)
      graphQLErrors.map(({
          message,
          locations,
          path
        }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      )
    if (networkError) console.log(`[Network error]: ${networkError}`)
  })

  const client = new ApolloClient({
    link: errorLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  console.log('client', client);

  return await client.query(gql);
}

export function Forms() {
  const forms = ref([]);
/*
  _gql('http://localhost:8080/msbt_admin/cid/api/forms.php', {
    query: gql `{
      forms {
        name
        tags
        comment
      }
    }`
  }).then((result) => {
    console.log(result)
    forms.value = result.data.forms;
  }, (error) => {
    console.log(error)
  });
*/
  const formNames = computed(() => {
    const tmp = [];
    for (const key in forms.value) {
      tmp.push(forms.value[key].name);
    }
    return tmp;
  });

  //watch(forms2, value =>{console.log('forms2', value)});
  //console.log('2', getForms2());
  /*
    watch(
      forms2,
      (newVal, oldVal) => {
        console.log('forms2', newVal)
      },
      {
        deep: true,
        sync: true,
      }
    );
  */
  //*
    getForms().then(
      (result) => {
        console.log("result2", result);
        if (result.data.data) {
          forms.value = result.data.data.forms;
        }
        //forms.value = result;//["data"]["data"]["forms"];
      }, (error) => {
        console.log('error2', error)
      });
  //*/
  return {
    forms,
    formNames,
    //forms2,
  };
}
