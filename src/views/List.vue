<template lang="pug">
.list
	//b-navbar(sticky=true, toggleable=true, variant='light')
	//b-container.mt-3
	b-row(size='sm')
		b-col(md='6')
			b-input-group(size='sm')
				b-input-group-prepend(is-text) form
				b-form-select(v-model="form", :options="formNames")
		b-col(md='6')
			b-input-group(size='sm')
				b-input-group-prepend(is-text) field
				b-form-select(v-model="formField", :options="formFieldNames")

		b-col.my-1(md='6')
			b-input-group(size='sm')
				b-input-group-prepend
					//b-button.mr-1(v-if="searchMode", size='sm', @click="searchStop()") 結束
					//b-button(@click="searchStart()") 查詢
					b-button(@click="test2") 查詢
				//b-form-input(type="text", v-model="searchString")
				b-form-input()
	| {{records}}
</template>
<script>
import {
  ref
} from '@vue/composition-api';
import {
  Forms
} from '@/components/Forms.js'; // @ is an alias to /src
import {
  Form
} from '@/components/Form.js'; // @ is an alias to /src

export default {
  props: {},
  setup(props, context) {

    const _forms = Forms();
    const forms = ref(_forms.forms);
    const formNames = ref(_forms.formNames)

    const form = ref("");
    const _form = Form(form);
    const formFields = ref(_form.formFields)
    const formField = ref(_form.formField)
    const formFieldNames = ref(_form.formFieldNames)
    const records = ref(_form.records)

    return {
      forms,
      form,
      formNames,
      formFields,
      formField,
      formFieldNames,
      records,
    };
  },
  methods: {
    test2: function() {
      console.log("eee");
    }
  }
};
</script>
