<template>
  <v-select
    :disabled="disabled"
    :multiple="true"
    :options="options"
    :taggable="taggable"
    :value="selected"
    @remove="deselect"
    @select="select"
    @tag="append"
    label="email"
    name="Recipients"
    trackBy="id">
  </v-select>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import pullAllBy from 'lodash/pullAllBy';
import values from 'lodash/values';
import VSelect from '@/components/common/form/VSelect';

export default {
  name: 'recipient-select',
  props: {
    disabled: { type: Boolean, default: false },
    recipients: { type: [Array], default: () => ([]) },
    taggable: { type: Boolean, default: true }
  },
  data() {
    return {
      id: -1,
      selected: this.recipients
    };
  },
  computed: {
    ...mapState('recipients', { options: ({ items }) => values(items) })
  },
  methods: {
    ...mapActions('recipients', ['fetch']),
    ...mapMutations('recipients', ['add', 'remove']),
    append(email) {
      const recipient = { email, id: this.id-- };
      this.add(recipient);
      this.select(recipient);
    },
    deselect(recipient) {
      const { pruneAppended, selected } = this;

      // Doesn't work with `_.remove` although it uses `.splice` internally
      selected.splice(findIndex(selected, { id: recipient.id }), 1);
      pruneAppended();
    },
    pruneAppended() {
      const { options, remove, selected } = this;
      const appended = filter(options, ({ id }) => id < 0);

      pullAllBy(appended, selected, 'id');
      remove(appended);
    },
    select(recipient) {
      this.selected.push(recipient);
    }
  },
  mounted() {
    this.fetch();
  },
  components: { VSelect }
};
</script>
