<template>
  <div id="app" >
    <div class="uk-background-primary uk-light uk-padding-small">
      <span class="">Toggl-to-Jira</span>
    </div>
    <nav uk-navbar class="uk-navbar-container">
      <div class="uk-navbar-left">
        <ul class="uk-navbar-nav">
          <router-link tag="li" to="/toggl-entries">
            <a>Toggl entries</a>
          </router-link>
          <router-link tag="li" to="/config">
            <a>Configuration</a>
          </router-link>
        </ul>
      </div>
    </nav>

    <!--    <div id="nav">
          <router-link to="/">Home</router-link> |
      <router-link to="/toggl-entries">Toggl entries</router-link> |
      <router-link to="/config">Config</router-link>
    </div>-->
    <div class="uk-container">
      <div class="uk-grid">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import "../node_modules/uikit/src/less/uikit.theme.less";

.uk-navbar-container {
  border-bottom: 1px solid lightblue;
}
/*
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
*/
</style>

<script>
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);
export default {};
</script>
