<template>
  <v-text-input
    :value="description"
    :validate="{
      required: true,
      max: 2000,
    }"
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
