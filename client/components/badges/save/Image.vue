<template>
  <div>
    <v-image-input
      :value="image"
      :width="300"
      :height="300"
      :accept="'image/svg+xml,image/png'"
      :size="0.256"
      :customStrings="messages"
      :hideChangeButton="true"
      @input="updateData('image', $event)"
      validate="required"
      name="image" />
    <v-input
      :value="imageCaption"
      @input="updateData('imageCaption', $event)"
      name="imageCaption" />
    <v-input
      :value="imageAuthorIri"
      @input="updateData('imageAuthorIri', $event)"
      name="imageAuthorIri" />
  </div>
</template>

<script>
import VInput from '@/components/common/form/VInput';
import VImageInput from '@/components/common/form/VImageInput';

const messages = {
  drag: 'Drag an image or <br>click here to select a file'
};

export default {
  name: 'image-input',
  inheritAttrs: false,
  props: {
    image: { type: String, default: '' },
    imageCaption: { type: String, default: '' },
    imageAuthorIri: { type: String, default: '' }
  },
  computed: {
    messages: () => messages
  },
  methods: {
    updateData(name, value) {
      this.$emit('input', { [name]: value });
    }
  },
  watch: {
    '$parent.$parent.active'(val) {
      if (val === 'imageSet') window.dispatchEvent(new UIEvent('resize'));
    }
  },
  components: { VInput, VImageInput }
};
</script>
