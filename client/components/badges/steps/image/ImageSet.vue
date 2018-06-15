<template>
  <div>
    <image-input :image="image" @input="updateData" />
    <caption-input :imageCaption="imageCaption" @input="updateData" />
    <author-iri-input :imageAuthorIri="imageAuthorIri" @input="updateData" />
  </div>
</template>

<script>
import ImageInput from './Image';
import CaptionInput from './Caption';
import AuthorIriInput from './AuthorIri';

export default {
  name: 'image-set',
  inheritAttrs: false,
  props: {
    image: { type: String, default: '' },
    imageCaption: { type: String, default: '' },
    imageAuthorIri: { type: String, default: '' }
  },
  methods: {
    updateData(data) {
      this.$emit('input', data);
    }
  },
  components: { AuthorIriInput, CaptionInput, ImageInput }
};
</script>
