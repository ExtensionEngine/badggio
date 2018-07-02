<template>
  <v-text-area-input
    :validate="{
      required: true,
      max: 2000,
    }"
    :value="description"
    @input="updateData"
    name="description" />
</template>

<script>
import VTextAreaInput from '@/components/common/form/VTextAreaInput';

export default {
  name: 'description',
  inheritAttrs: false,
  props: {
    description: { type: String, default: '' }
  },
  methods: {
    updateData(description) {
      this.$emit('input', { description });
    }
  },
  components: { VTextAreaInput }
};
</script>
