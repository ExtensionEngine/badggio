<template>
  <div class="tile is-parent">
    <div class="tile is-child notification box">
      <p class="title">
        <span class="icon mdi mdi-clipboard-text-outline"></span>Basic info
      </p>
      <div class="columns is-8 is-variable">
        <div class="column">
          <div class="content">
            <v-image-input
              :value="image"
              :width="300"
              :height="300"
              :accept="'image/svg+xml,image/png'"
              :size="0.256"
              :customStrings="messages"
              :hideChangeButton="true"
              @input="$emit('update:image', $event)"
              validate="required"
              name="image" />
            <v-input
              :value="imageCaption"
              @input="$emit('update:imageCaption', $event)"
              name="imageCaption" />
            <v-input
              :value="imageAuthorIri"
              @input="$emit('update:imageAuthorIri', $event)"
              name="imageAuthorIri" />
          </div>
        </div>
        <div class="column">
          <div class="content">
            <v-input
              :validate="{ required: true, max: 255 }"
              :value="name"
              @input="$emit('update:name', $event)"
              name="name" />
            <v-text-area-input
              :validate="{ required: true, max: 2000 }"
              :value="description"
              @input="$emit('update:description', $event)"
              name="description" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VImageInput from '@/components/common/form/VImageInput';
import VInput from '@/components/common/form/VInput';
import VTextAreaInput from '@/components/common/form/VTextAreaInput';

const messages = {
  drag: 'Drag an image or <br>click here to select a file'
};

export default {
  name: 'basic-info',
  inheritAttrs: false,
  props: {
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    imageAuthorIri: { type: String, default: '' },
    imageCaption: { type: String, default: '' },
    name: { type: String, default: '' }
  },
  computed: {
    messages: () => messages
  },
  components: { VInput, VImageInput, VTextAreaInput }
};
</script>
