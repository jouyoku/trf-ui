<template>
  <div class="setup">
    <h1>This is an about page</h1>
  </div>
</template>
<script>
import {
  // getForms,
  // getFormFields,
  getFormRecordsId,
  // getFormRecords
} from "@/components/lib/js/GraphQL.js";

export default {
  props: {},
  setup(props, context) {
    getFormRecordsId("product").then((r) => {
      console.log("bb", r);
    });
    // const forms = getForms();
    // console.log(resolve(getForms());
    return {};
  },
};
</script>
