<template>
  <v-input
    :value="criteriaNarrative"
    :validate="{
      max: 255,
      required: true
    }"
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
