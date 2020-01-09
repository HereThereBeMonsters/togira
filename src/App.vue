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

    <div class="uk-container">
      <div class="uk-grid uk-margin-top">
        <router-view/>
      </div>
    </div>
  </div>

</template>

<style lang="less">
@import "global.less";

.banner {
  padding: 10px;

  & img {
    max-height: 75px;
  }
}

</style>

<script>
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);
export default {};
</script>
