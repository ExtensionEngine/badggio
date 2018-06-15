<template>
  <v-tags-input
    :value="data"
    :validate="'required'"
    @input="updateData"
    name="tags" />
</template>

<script>
import VTagsInput from '@/components/common/form/VTagsInput';
import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'tags',
  inheritAttrs: false,
  props: {
    tags: { type: Array, default: () => [] }
  },
  computed: {
    data() {
      return cloneDeep(this.tags);
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
