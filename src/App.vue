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
      <div class="uk-grid">
        <router-view/>
      </div>
    </div>
  </div>

</template>

<style lang="less">
@import "../node_modules/uikit/src/less/uikit.theme.less";

@global-color: #666;
@global-emphasis-color: #333;
@global-muted-color: #999;
@global-link-color: #C56368;
@global-link-hover-color: #e2787d;

@global-inverse-color: #D6DD88;
@global-background: #fff;

@global-muted-background: #D6DD88;
@global-primary-background: #4060A1;
@global-secondary-background: #222;

@global-font-family: 'Roboto', sans-serif;
@global-font-size: 16px;

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
