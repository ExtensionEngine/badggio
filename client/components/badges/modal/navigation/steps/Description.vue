<template>
  <v-text-input
    :validate="{
      required: true,
      max: 2000,
    }"
    :value="description"
    @input="updateData"
    name="description" />
</template>

<script>
import VTextInput from '@/components/common/form/VTextInput';

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
  components: { VTextInput }
};
</script>
