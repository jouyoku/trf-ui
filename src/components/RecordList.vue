<template lang="pug">
div
  | {{records.length}}
</template>
<script>
export default {
  name: "RecordList",
  props: ['records']
};
</script>
