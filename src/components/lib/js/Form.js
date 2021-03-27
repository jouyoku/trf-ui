import { ref, computed, watch, set } from "@vue/composition-api";
import axios from "axios";
import { url as gqlFormUrl, query as gqlFormQuery } from "./graphqlForm.js";
import { isStrJson, epoch2Date } from "./utils.js";

export function Form(formName) {
  const _url = ref(gqlFormUrl + "?name=" + formName);

  const form = ref(formName);
  const formFields = ref([]);
  const formField = ref("");
  const records = ref([]);
  const selects = ref({});
  const dates = ref([]);

  const formFieldNames = computed(() => {
    const tmp = ["_id"];
    for (const key in formFields.value) {
      tmp.push(formFields.value[key].name);
    }
    return tmp;
  });

  const graphqlFormQueryRecordsId = computed(() => {
    return gqlFormQuery.records2.replace("__FIELDS__", "_id");
  });

  const graphqlFormQueryRecords = computed(() => {
    return gqlFormQuery.records2.replace(
      "__FIELDS__",
      formFieldNames.value.join("\n")
    );
  });

  const transformRecord = (record0) => {
    for (const j in selects.value) {
      let value = record0[j];
      if (!selects.value[j][value] && isStrJson(value)) {
        value = JSON.parse(value);
      }
      if (!selects.value[j][value] && isStrJson(value)) {
        value = JSON.parse(value);
      }
      record0[j] = selects.value[j][value];
    }
    for (const j of dates.value) {
      if (record0[j] == null || isNaN(record0[j])) {
        continue;
      }
      record0[j] = epoch2Date(record0[j]);
    }

    return record0;
  };

  const updateRecords = async (fromId, count) => {
    await axios
      .post(_url.value, {
        query: graphqlFormQueryRecords.value,
        variables: {
          condition: "ORDER BY _id LIMIT " + fromId + "," + count,
        },
      })
      .then(
        (result) => {
          for (let i = 0; i < result.data.data.records2.length; i++) {
            let index = fromId + i;
            if (records.value[index]._id == result.data.data.records2[i]._id) {
              set(
                records.value,
                index,
                transformRecord(result.data.data.records2[i])
              );
              continue;
            }

            if (records.value[index]._id > result.data.data.records2[i]._id) {
              index = index - 1;
              while (
                records.value[index]._id > result.data.data.records2[i]._id
              ) {
                index = index - 1;
              }
              if (
                records.value[index]._id == result.data.data.records2[i]._id
              ) {
                set(
                  records.value,
                  index,
                  transformRecord(result.data.data.records2[i])
                );
                continue;
              }
              records.value.splice(
                index + 1,
                0,
                transformRecord(result.data.data.records2[i])
              );
              this.table.totalRows.value = records.value.length;
              continue;
            }
            while (
              records.value[index]._id < result.data.data.records2[0]._id
            ) {
              index = index + 1;
            }
            if (records.value[index]._id == result.data.data.records2[i]._id) {
              set(
                records.value,
                index,
                transformRecord(result.data.data.records2[i])
              );
              continue;
            }
            records.value.splice(
              index,
              0,
              transformRecord(result.data.data.records2[i])
            );
            this.table.totalRows.value = records.value.length;
          }
        },
        (error) => {
          console.error("error", error);
        }
      );
  };
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
    async (newVal, oldVal) => {
      if (newVal == "") {
        return;
      }

      _url.value = gqlFormUrl + "?name=" + form.value;

      await axios
        .post(_url.value, {
          query: gqlFormQuery.fields,
        })
        .then(
          (result) => {
            formFields.value = result.data.data.fields;
            for (const key in formFields.value) {
              set(
                formFields.value[key],
                "attributes",
                JSON.parse(formFields.value[key].attributes)
              );
              if (formFields.value[key].type == "select") {
                if (typeof formFields.value[key].attributes !== "string") {
                  continue;
                }
                const tmp1 = JSON.parse(formFields.value[key].attributes)
                  .options;
                const tmp2 = {};
                for (const tmp3 of tmp1) {
                  tmp2[tmp3.value] = tmp3.text;
                }
                selects.value[formFields.value[key].name] = tmp2;
              }
              if (formFields.value[key].type == "date") {
                dates.value.push(formFields.value[key].name);
              }
            }
          },
          (error) => {
            console.error("error", error);
          }
        );

      await axios
        .post(_url.value, {
          query: graphqlFormQueryRecordsId.value,
        })
        .then(
          (result) => {
            records.value = result.data.data.records2;
            let i = records.value.length - 15;
            let count = 15;
            if (i < 0) {
              count = count + i;
              i = 0;
            }
            updateRecords(i, count);
          },
          (error) => {
            console.error("error", error);
          }
        );
    },
    {
      deep: true,
      sync: true,
    }
  );

  return {
    form,
    formFields,
    formField,
    formFieldNames,
    // formHeaderFields,
    records,
  };
}
