import axios from "axios";
import { url as gqlFormsUrl, query as gqlFormsQuery } from "./graphqlForms.js";
import {
  url as gqlFormUrl,
  query as gqlFormQuery,
  mutation as gqlFormMutation,
} from "./graphqlForm.js";
import { whereStr, whereStrContains } from "./utils.js";
import _ from "lodash";

export async function getForms() {
  try {
    const response = await axios.post(gqlFormsUrl, {
      query: gqlFormsQuery.forms,
    });
    return response.data.data.forms;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function getFormNames(forms) {
  const tmp = [];
  for (const key in forms) {
    tmp.push(forms[key].name);
  }
  return tmp;
}

export function gqlFormUrl1(form) {
  return gqlFormUrl + "?name=" + form;
}

export async function getFormFields(form) {
  try {
    const response = await axios.post(gqlFormUrl1(form), {
      query: gqlFormQuery.fields,
    });
    const res = {
      fields: response.data.data.fields,
      selects: {},
      dates: [],
    };
    for (const key in res.fields) {
      if (typeof res.fields[key].attributes === "string") {
        res.fields[key].attributes = JSON.parse(res.fields[key].attributes);
      }
      switch (res.fields[key].type) {
        case "select": {
          const tmp = {};
          for (const option of res.fields[key].attributes.options) {
            tmp[option.value] = option.text;
          }
          res.selects[res.fields[key].name] = tmp;
          break;
        }
        case "date": {
          res.dates.push(res.fields[key].name);
          break;
        }
        default:
      }
    }
    return res;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function gqlFormQueryRecordsId() {
  return gqlFormQuery.records2.replace("__FIELDS__", "_id");
}

export function gqlFormQueryRecords(formFieldNames) {
  return gqlFormQuery.records2.replace("__FIELDS__", formFieldNames.join("\n"));
}

export async function getFormRecordsId(form) {
  try {
    const response = await axios.post(gqlFormUrl1(form), {
      query: gqlFormQueryRecordsId(),
    });
    return response.data.data.records2;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function formFieldNames(formFields) {
  const tmp = ["_id"];
  for (const key in formFields) {
    tmp.push(formFields[key].name);
  }
  return tmp;
}

export async function getFormRecords(form, formFieldNames, fromId, count) {
  try {
    const response = await axios.post(gqlFormUrl1(form), {
      query: gqlFormQueryRecords(formFieldNames),
      variables: {
        condition: "ORDER BY _id LIMIT " + fromId + "," + count,
      },
    });
    return response.data.data.records2;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function deleteRecord(form, id) {
  try {
    const response = await axios.post(gqlFormUrl1(form), {
      query: gqlFormMutation.deleteRecord,
      variables: {
        where: whereStr(id),
      },
    });
    return response.data.data.deleteRecord;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function formSearch(form, formFieldNames, search) {
  try {
    const response = await axios.post(gqlFormUrl1(form), {
      query: gqlFormQueryRecords(formFieldNames),
      variables: {
        condition: "WHERE " + whereStrContains(search, formFieldNames),
      },
    });
    return response.data.data.records2;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function modifyField(form, fieldName, newField, move = "") {
  try {
    const tmp = _.cloneDeep(newField);
    tmp.attributes = JSON.stringify(tmp.attributes);
    const response = await axios.post(gqlFormUrl1(form), {
      query: gqlFormMutation.changeField,
      variables: {
        fieldName: fieldName,
        newField: tmp,
        move: move,
      },
    });
    return response.data.data.changeField;
  } catch (error) {
    console.error(error);
    return false;
  }
}
