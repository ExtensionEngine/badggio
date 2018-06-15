<template>
  <v-input
    :value="imageCaption"
    :validate="{
      max: 255,
      required: true
    }"
    @input="updateData"
    name="imageCaption" />
</template>

<script>
import VInput from '@/components/common/form/VInput';

export default {
  name: 'image-caption',
  inheritAttrs: false,
  props: {
    imageCaption: { type: String, default: '' }
  },
  methods: {
    updateData(imageCaption) {
      this.$emit('input', { imageCaption });
    }
  },
  components: { VInput }
};
</script>
