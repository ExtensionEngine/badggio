<template>
  <iframe
    :src="url"
    :style="style"
    @load="onLoad"
    scrolling="no"
    class="viewer"></iframe>
</template>

<script>
import { ResizeSensor } from 'css-element-queries';

const hiddenSections = '.topbar, .information-container';

const hide = (...elements) => elements.forEach(el => (el.style.display = 'none'));
const noop = Function.prototype;

export default {
  name: 'swagger-viewer',
  props: {
    url: {
      type: String,
      required: true
    },
    auth: {
      type: Object,
      default: () => ({})
    },
    logger: {
      type: Object,
      default: () => ({ error: noop })
    }
  },
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
      const iframe = this.iframe = e.target;
      const { console, document } = iframe.contentWindow;
      this.authorize();
      Object.assign(console, this.logger);
      const updateHeight = () => (this.height = document.body.scrollHeight);
      if (this.resizeSensor) this.resizeSensor.detach();
      hide(...Array.from(document.querySelectorAll(hiddenSections)));
      this.resizeSensor = new ResizeSensor(document.body, updateHeight);
      updateHeight();
    },
    authorize({ key, type, ...options } = this.auth) {
      const ui = this.iframe && this.iframe.contentWindow.ui;
      if (!ui) return;
      if (type === 'basic') {
        const { username, password } = options;
        return username && password && ui.preauthorizeBasic(key, username, password);
      }
      return options.value && ui.preauthorizeApiKey(key, options.value);
    }
  },
  watch: {
    auth: () => this.authorize()
  },
  beforeDestroy() {
    if (this.resizeSensor) this.resizeSensor.detach();
  }
};
</script>

<style lang="scss" scoped>
.viewer {
  width: 100%;
  border: 0;
  transition: opacity 0.4s ease-in;
}
</style>
