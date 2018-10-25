<template>
  <div class="container docs">
    <h1 class="title">Api Docs</h1>
    <iframe :style="style" @load="onLoad" scrolling="no" src="/docs"></iframe>
  </div>
</template>

<script>
import { ResizeSensor } from 'css-element-queries';

export default {
  name: 'docs',
  data() {
    return { height: 0 };
  },
  computed: {
    style() {
      return {
        height: `${this.height}px`,
        opacity: Math.min(this.height, 1)
      };
    }
  },
  methods: {
    onLoad(e) {
      const iframe = e.target;
      const body = getBody(iframe);
      const updateHeight = () => (this.height = body.scrollHeight);
      if (this.resizeSensor) this.resizeSensor.detach();
      this.resizeSensor = new ResizeSensor(body, updateHeight);
      updateHeight();
    }
  },
  beforeDestroy() {
    if (this.resizeSensor) this.resizeSensor.detach();
  }
};

function getBody(iframe) {
  return iframe.contentWindow.document.body;
}
</script>

<style lang="scss" scoped>
.docs iframe {
  width: 100%;
  margin-bottom: 6.25em;
  border: 0;
  transition: opacity 0.5s ease-in;
}
</style>
