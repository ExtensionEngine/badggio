<template>
  <v-select
    :disabled="disabled"
    :multiple="multiple"
    :name="name"
    :options="recipients"
    :taggable="taggable"
    :value="selected"
    @remove="deselect"
    @select="select"
    @tag="append"
    label="email"
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
    taggable: { type: Boolean, default: true },
    multiple: { type: Boolean, default: false },
    recipient: { type: [Array, Object], default: null }
  },
  data() {
    return {
      id: -1,
      selected: this.recipient
    };
  },
  computed: {
    ...mapState('recipients', { recipients: ({ items }) => values(items) }),
    name() {
      return this.multiple ? 'Recipients' : 'Recipient';
    }
  },
  methods: {
    ...mapActions('recipients', ['fetch']),
    ...mapMutations('recipients', ['add', 'remove']),
    append(email) {
      const recipient = { email, id: this.id-- };
      this.add(recipient);
      this.select(recipient);
    },
    pruneAppended() {
      const { multiple, recipients, remove, selected } = this;
      const appended = filter(recipients, ({ id }) => id < 0);

      if (!multiple) {
        pullAllBy(appended, [selected], 'id');
        return remove(appended);
      }

      pullAllBy(appended, selected, 'id');
      remove(appended);
    },
    deselect(recipient) {
      const { pruneAppended, multiple, selected } = this;

      if (!multiple) {
        this.selected = null;
        return pruneAppended();
      }
      // Doesn't work with `_.remove` although it uses `.splice` internally
      selected.splice(findIndex(selected, { id: recipient.id }), 1);
      pruneAppended();
    },
    select(recipient) {
      const { pruneAppended, multiple, selected } = this;

      if (multiple) return selected.push(recipient);
      this.selected = recipient;
      pruneAppended();
    }
  },
  created() {
    const { multiple, recipient } = this;

    if (!recipient) {
      this.selected = multiple ? [] : null;
      return;
    }

    if (multiple ^ Array.isArray(recipient)) {
      const expected = multiple ? 'Array' : 'Object';
      throw Error('Invalid configuration: ' +
        `"multiple" prop is set to "${multiple}" - ` +
        `"recipient" prop should be an ${expected}, ${typeof recipient} given.`);
    }
  },
  mounted() {
    this.fetch();
  },
  components: { VSelect }
};
</script>
