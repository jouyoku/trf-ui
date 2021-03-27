<i18n>
  {
    "en-US": {
      "首頁": "Home",
      "列表": "List",
      "填表": "Edit",
      "設定": "Setup"
    },
    "zh-TW": {
      "首頁": "首頁",
      "列表": "列表",
      "填表": "填表",
      "設定": "設定"
    }
  }
</i18n>
<template lang="pug">
#app
  b-row(align-v="center")
    b-col
      h3 Form2
    b-col
      #nav
        router-link(:to="'/' + $i18n.locale") {{ $t('首頁') }}
        |  |&nbsp;
        router-link(:to="'/' + $i18n.locale + '/list'") {{ $t('列表') }}
        |  |&nbsp;
        router-link(:to="'/' + $i18n.locale + '/form'") {{ $t('填表') }}
        |  |&nbsp;
        router-link(:to="'/' + $i18n.locale + '/setup'") {{ $t('設定') }}
    //b-col(cols="auto")
      b-form-select(size="sm", v-model="locale", :options="languages")
  router-view
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<script>
import { ref, watch } from "@vue/composition-api";

export default {
  watch: {
    $route: function() {
      // 在这里强制更新
      console.log('aaa')
      this.$forceUpdate();
    }
  },
  setup(props, context) {
    //console.log(context, context.root.$i18n.locale);
    const locale = ref(context.root.$i18n.locale);
    //if (localStorage.getItem("locale")) {
    //  locale.value = localStorage.getItem("locale");
    //}

    const languages = ref([
      { value: "zh-TW", text: "繁體中文" },
      { value: "en-US", text: "English" },
    ]);

    watch(locale, (val, oldVal) => {
      //console.log(val, oldVal, location);
      //localStorage.setItem("locale", val);
      context.root.$i18n.locale = val;
      const tmp = location.href.replace(oldVal, val)
      location.replace(tmp)
/*
      window.history.pushState(
        null,
        null,
        location.origin + "/" + val + location.pathname.substring(location.pathname.indexOf(oldVal) + oldVal.length)
      )
//*/
    });

    return {
      locale,
      languages,
    };
  },
};
</script>
