<template>
  <v-select
    :disabled="disabled"
    :multiple="false"
    :options="badges"
    :value="selected"
    @remove="deselect"
    @select="select"
    name="Badge"
    trackBy="id">
  </v-select>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import map from 'lodash/map';
import values from 'lodash/values';
import VSelect from '@/components/common/form/VSelect';

const badgeMapper = badge => {
  const { id, image, name, imageCaption, description } = badge;
  return {
    id,
    image,
    title: name,
    alt: imageCaption,
    desc: description
  };
};

export default {
  name: 'badge-select',
  props: {
    disabled: { type: Boolean, default: false },
    badge: { type: Object, default: null }
  },
  data() {
    return {
      selected: this.badge
    };
  },
  computed: {
    ...mapState('badges', { badges: ({ items }) => map(values(items), badgeMapper) })
  },
  methods: {
    ...mapActions('badges', ['fetch']),
    deselect() {
      this.selected = null;
    },
    select(badge) {
      this.selected = badge;
    }
  },
  created() {
    this.fetch();
  },
  components: { VSelect }
};
</script>
