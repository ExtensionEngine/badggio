<template>
  <v-input
    :value="imageAuthorIri"
    :validate="{
      max: 255,
      required: true
    }"
    @input="updateData"
    name="imageAuthorIri" />
</template>

<script>
import VInput from '@/components/common/form/VInput';

export default {
  name: 'image-author-iri',
  inheritAttrs: false,
  props: {
    imageAuthorIri: { type: String, default: '' }
  },
  methods: {
    updateData(imageAuthorIri) {
      this.$emit('input', { imageAuthorIri });
    }
  },
  components: { VInput }
};
</script>
