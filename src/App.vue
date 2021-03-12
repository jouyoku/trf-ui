<template lang="pug">
#app
  b-row(align-v="center")
    b-col
      h3 記錄
    b-col
      #nav
        router-link(to='/') 首頁
        |  |
        router-link(to='/list') 列表
        |  |
        router-link(to='/form') 填寫
        |  |
        router-link(to='/setup') 設定
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
