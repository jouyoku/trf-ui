/*
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client/core'
//*/

export function tags2str(tags) {
  if (tags == "") {
    tags = "[]";
  }
  const tmp = JSON.parse(tags);
  let str = "";
  for (const key in tmp) {
    str = str + tmp[key] + ", ";
  }
  return str.slice(0, -2);
}

export function classObjectColumns(columns) {
  const tmp = {
    "d-none": columns[0].cols == 0,
    "d-sm-none": columns[1].cols == 0,
    "d-md-none": columns[2].cols == 0,
    "d-lg-none": columns[3].cols == 0,
    "d-xl-none": columns[4].cols == 0,
    "d-block": columns[0].cols > 0,
    "d-sm-block": columns[1].cols > 0,
    "d-md-block": columns[2].cols > 0,
    "d-lg-block": columns[3].cols > 0,
    "d-xl-block": columns[4].cols > 0,
    //"mt-3": item.marginTop > 0 ? item.marginTop : false,
  };
  for (const key in columns) {
    let bp = columns[key].bp + "-";
    if (columns[key].bp == "xs") {
      bp = "";
    }
    tmp["mt-" + bp + columns[key].mt] = columns[key].mt;
    tmp["mb-" + bp + columns[key].mb] = columns[key].mb;
    tmp["ml-" + bp + columns[key].ml] = columns[key].ml;
    tmp["mr-" + bp + columns[key].mr] = columns[key].mr;
  }
  //if (item.marginTop > 0) {
  //}
  return tmp;
}

export function isStrJson(str) {
  if (typeof str !== "string") {
    return false;
  }
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export function isNameAlphanumeric(name) {
  return new RegExp("^[a-z|A-Z|0-9][a-z|A-Z|0-9|_]*$").test(name);
}

export function whereStr(value, column = "_id") {
  return "`" + column + "` = '" + value + "'";
}

export function whereStrContains(text, columns) {
  let where = "";
  for (const fieldName of columns) {
    where = where + "`" + fieldName + "` LIKE '%" + text + "%' OR ";
  }
  where = where.substr(0, where.length - 3);
  return where;
}

export function isSimpleInputField(type) {
  const simpleInputFields = [
    "color",
    "date",
    "datetime",
    "email",
    //"file",
    "month",
    "password",
    "tel",
    "text",
    "time",
    "url",
    "week",
  ];
  return simpleInputFields.includes(type);
}

export function isField(type) {
  return type.startsWith("*");
}

export function epoch2Date(epoch) {
  const tmp = new Date(parseInt(epoch));
  const mm = tmp.getMonth() + 1;
  const dd = tmp.getDate();
  return [
    tmp.getFullYear(),
    (mm > 9 ? "" : "0") + mm,
    (dd > 9 ? "" : "0") + dd,
  ].join("-");
}
/*
export function getApolloClient(uri) {
  // HTTP connection to the API
  const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: uri,
  })

  // Cache implementation
  const cache = new InMemoryCache()

  // Create the apollo client
  return new ApolloClient({
    link: httpLink,
    cache,
  })
}
//*/
