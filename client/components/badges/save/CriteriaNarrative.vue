<template>
  <v-input
    :validate="{
      max: 255,
      required: true
    }"
    :value="criteriaNarrative"
    @input="updateData"
    name="criteriaNarrative" />
</template>

<script>
import VInput from '@/components/common/form/VInput';

export default {
  name: 'criteria-narrative',
  inheritAttrs: false,
  props: {
    criteriaNarrative: { type: String, default: '' }
  },
  methods: {
    updateData(criteriaNarrative) {
      this.$emit('input', { criteriaNarrative });
    }
  },
  components: { VInput }
};
</script>
