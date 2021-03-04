export const url = "http://localhost:8080/msbt_admin/cid/api/form.php";

export const mutation = {
  add: `mutation ($record: FormRecordInput) {
          add(record: $record)
        }`,
  update: ` mutation ($record: FormRecordInput, $where: String) {
              update(record: $record, where: $where)
            }`,
  deleteRecord: ` mutation ($where: String!) {
                    deleteRecord(where: $where)
                  }`,
  updateSettings: ` mutation ($settings: FormSettingsInput) {
                      updateSettings(settings: $settings)
                    }`,
  addField: ` mutation ($newField: FormFieldSettingsInput!, $move: String) {
                addField(newField: $newField, move: $move)
              }`,
  dropField: `mutation ($fieldName: String!) {
                dropField(fieldName: $fieldName)
              }`,
  changeField: `mutation ($fieldName: String!, $newField: FormFieldSettingsInput!, $move: String) {
                  changeField(fieldName: $fieldName, newField: $newField, move: $move)
                }`,
  changeFieldHidden: `mutation ($names: [String]!, $value: Boolean!) {
                        changeFieldHidden(names: $names, value: $value)
                      }`,
};

export const query = {
  count: `{
            count
          }`,
  formFields: ` {
                  fields {
                    name
                    type
                    comment
                    init
                    attributes
                    hidden
                  }
                }`,
  fields: ` {
              fields {
                name
                type
                comment
                init
                attributes
                hidden
              }
              settings {
                version
                name
                tags
                comment
                layout
                functions
                style
                user
                print
                i18n
                _changes
              }
            }`,
  records: ` query ($where: String) {
                records(where: $where) {
                  __FIELDS__
                }
              }`,
  records2: `query ($condition: String) {
                records2(condition: $condition) {
                  __FIELDS__
                }
              }`,
};
