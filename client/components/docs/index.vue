<template>
  <div class="container docs">
    <h1 class="title">Api Docs</h1>
    <iframe
      ref="frame"
      :height="height"
      @load="load"
      class="frame"
      scrolling="no"
      src="/docs">
    </iframe>
  </div>
</template>

<script>
import elementQueries from 'css-element-queries';
import get from 'lodash/get';

export default {
  name: 'docs',
  data() {
    return { height: 500 };
  },
  methods: {
    frameBody() {
      return get(this.$refs.frame, 'contentWindow.document.body');
    },
    setHeight() {
      this.height = this.frameBody().scrollHeight;
    },
    load() {
      this.setHeight();
      elementQueries.ResizeSensor(this.frameBody(), this.setHeight);
    }
  }
};
</script>

<style lang="scss" scoped>
.docs .frame {
  width: 100%;
  margin-bottom: 100px;
}
</style>
