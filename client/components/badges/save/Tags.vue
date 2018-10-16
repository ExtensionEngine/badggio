<template>
  <div class="tile is-parent">
    <div class="tile is-child notification box">
      <p class="title">
        <span class="icon mdi mdi-tag-text-outline"></span>Badge Tags
      </p>
      <div class="content">
        <v-tags-input
          v-bind="$attrs"
          :tags="tags"
          v-on="$listeners"
          name="tags" />
      </div>
    </div>
  </div>
</template>

<script>
import VTagsInput from '@/components/common/form/VTagsInput';

export default {
  name: 'tags',
  inheritAttrs: false,
  props: {
    tags: { type: Array, default: () => [] }
  },
  components: { VTagsInput }
};
</script>
