<template>
  <v-input
    :value="name"
    :validate="{
      required: true,
      max: 255,
      'unique-name': data
    }"
    @input="updateData"
    name="name" />
</template>

<script>
import VInput from '@/components/common/form/VInput';
import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'name',
  inheritAttrs: false,
  props: {
    name: { type: String, default: '' },
    badgeData: { type: Object, default: () => {} }
  },
  computed: {
    data() {
      return cloneDeep(this.badgeData);
    }
  },
  methods: {
    updateData(name) {
      this.$emit('input', { name });
    }
  },
  components: { VInput }
};
</script>
