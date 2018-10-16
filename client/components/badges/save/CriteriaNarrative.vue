<template>
  <div class="tile is-parent">
    <div class="tile is-child notification box">
      <p class="title">
        <span class="icon mdi mdi-clipboard-check-outline"></span>Criteria
      </p>
      <div class="content">
        <v-input
          :validate="{ max: 255, required: true }"
          :value="criteriaNarrative"
          @input="$emit('update:criteriaNarrative', $event)"
          name="criteriaNarrative" />
      </div>
    </div>
  </div>
</template>

<script>
import VInput from '@/components/common/form/VInput';

export default {
  name: 'criteria-narrative',
  inheritAttrs: false,
  props: {
    criteriaNarrative: { type: String, default: '' }
  },
  components: { VInput }
};
</script>
