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
import cloneDeep from 'lodash/cloneDeep';
import VInput from '@/components/common/form/VInput';

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
