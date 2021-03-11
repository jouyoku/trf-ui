export const url = process.env.VUE_APP_gqlFormsUrl;

export const mutation = {
  add: `mutation ($formName: String!, $fields: [FormFieldSettingsInput], $settings: FormSettingsInput) {
          add(formName: $formName, fields: $fields, settings: $settings)
        }`,
  rename: ` mutation ($formName: String!, $newName: String!) {
              rename(formName: $formName, newName: $newName)
            }`,
  drop: ` mutation ($formName: String!) {
            drop(formName: $formName)
          }`,
};

export const query = {
  formColumnTypes: `{
                      formColumnTypes
                    }`,
  forms: `{
            forms {
              name
              tags
              comment
            }
          }`,
};