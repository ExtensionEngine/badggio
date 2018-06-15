<template>
  <v-image-input
    :width="300"
    :height="300"
    :accept="'image/svg,image/png'"
    :size="10"
    :customStrings="{
      upload: '<h1>Bummer!</h1>',
      drag: 'Drag an image or <br>click here to select a file'
    }"
    :validate="'required'"
    @input="updateData"
    name="image" />
</template>

<script>
import VImageInput from '@/components/common/form/VImageInput';

export default {
  name: 'image-input',
  inheritAttrs: false,
  props: {
    image: { type: String, default: '' }
  },
  methods: {
    updateData(image) {
      this.$emit('input', { image });
    }
  },
  components: { VImageInput }
};
</script>
