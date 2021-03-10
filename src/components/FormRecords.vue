<template lang="pug">
.list
	b-row(size='sm')
		b-col(md='6')
			b-input-group(size='sm')
				b-input-group-prepend(is-text) field
				b-form-select(v-model="formField", :options="formFieldNames")

		b-col.my-1(md='6')
			b-input-group(size='sm')
				b-input-group-prepend
					//b-button.mr-1(v-if="searchMode", size='sm', @click="searchStop()") 結束
					//b-button(@click="searchStart()") 查詢
					//b-button(@click="test2") 查詢
				//b-form-input(type="text", v-model="searchString")
				b-form-input()
	RecordList(:records="records", :fields="formHeaderFields", @currentPageChanged="onCurrentPageChanged")
</template>
<script>
import {
  ref,
  watch,
  set,
  toRefs,
  computed,
} from '@vue/composition-api';
import RecordList from '@/components/RecordList.vue'; // @ is an alias to /src
import * as gql from '@/components/lib/js/GraphQL.js'

export default {
  props: {
    form: {
      type: String,
      default: "",
    },
  },
  components: {
    RecordList,
  },
  setup(props, context) {
    const { form } = toRefs(props)
    const formFields = ref([])
    const formFieldNames = ref([])
    const formField = ref("")
    const records = ref([])
    //const currentPage = ref(1);

    const updateRecords = (fromId, newRecords) => {
      for (const record of newRecords) {
        for (let i = 0; i < newRecords.length; i++) {
          if (records.value[fromId + i]._id !== record._id) {
            continue;
          }
          set(records.value, fromId + i, record);
          continue;
        }
      }
    }

    const onCurrentPageChanged = async (currentPage) => {
      let fromId = records.value.length - currentPage * 15;
      let count = 15;
      if (fromId < 0) {
        count = count + fromId;
        fromId = 0;
      }
      await gql.getFormRecords(form.value, formFieldNames.value, fromId, count).then((r) => {
        updateRecords(fromId, r);
      }, (e) => {
        console.error(e);
      });
    }

    const formHeaderFields = computed(() => {
      const tmp = [{ key: "_id", label: "ID" }];
      for (const field of formFields.value) {
        if (field.hidden) {
          //continue;
        }
        tmp.push({ key: field.name, label: field.comment });
      }
      return tmp;
    });

    watch(
      form,
      async (newVal, oldVal) => {
        if (newVal == "") {
          return;
        }

        await gql.getFormFields(newVal).then((r) => {
          formFields.value = r.fields;
          formFieldNames.value = gql.formFieldNames(formFields.value);
        }, (e) => {
          console.error(e);
        });

        await gql.getFormRecordsId(newVal).then((r) => {
          records.value = r;
        }, (e) => {
          console.error(e);
        });

        onCurrentPageChanged(1);

      }, {
        deep: true,
        sync: true,
      }
    );

    return {
      formFields,
      formField,
      formFieldNames,
      records,
      onCurrentPageChanged,
      formHeaderFields,
    };
  },
};
</script>
