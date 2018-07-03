<template>
  <v-tags-input :value="data" @input="updateData" name="tags" />
</template>

<script>
import clone from 'lodash/clone';
import VTagsInput from '@/components/common/form/VTagsInput';

export default {
  name: 'tags',
  inheritAttrs: false,
  props: {
    tags: { type: Array, default: () => [] }
  },
  computed: {
    data() {
      return clone(this.tags || []);
    }
  },
  methods: {
    updateData(tags) {
      this.$emit('input', { tags });
    }
  },
  components: { VTagsInput }
};
</script>
