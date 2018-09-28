<template>
  <v-input
    :validate="{
      required: true,
      max: 255
    }"
    :value="name"
    @input="updateData"
    name="name" />
</template>

<script>
import VInput from '@/components/common/form/VInput';

export default {
  name: 'name',
  inheritAttrs: false,
  props: {
    name: { type: String, default: '' }
  },
  methods: {
    updateData(name) {
      this.$emit('input', { name });
    }
  },
  components: { VInput }
};
</script>
