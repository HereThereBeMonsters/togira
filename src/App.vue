<template>
  <div id="app">
    <div class="uk-background-primary uk-light uk-padding-small banner">
      <img src="./assets/logo_text_big.png" alt="Magnificent Toggira Logo - End The Pain!">
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

    <div class="uk-container page-body">
      <div class="uk-grid uk-margin-top">
        <router-view/>
      </div>
    </div>

    <footer id="app--footer" class="uk-margin-top uk-light uk-background-primary">
      <div class="uk-container uk-flex uk-flex-between">
        <div class="uk-text-small uk-flex">
          Toggira - Copyright &copy; 2020 by Pierre Henry
        </div>
        <a href="https://github.com/HereThereBeMonsters/toggl-to-jira/" class="uk-text-small">
          <span uk-icon="icon: github-alt; ratio: 0.8"></span>
          Project on github
        </a>
      </div>
    </footer>
  </div>

</template>

<style lang="less">
@import "global.less";

.banner {
  padding: 7px;

  & img {
    max-height: 30px;
  }
}

#app {
  height: 100%;
}

.page-body {
  min-height: calc(100% - 187px); // height of banner + navbar + footer = 60 + 80 +  47 = 187
}

#app--footer {
  padding: 3px;
}

</style>

<script>
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);
export default {};
</script>
