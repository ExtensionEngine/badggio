<template>
  <div>
    <h1 class="title">Badges</h1>
    <button
      @click="create"
      class="btn-create button is-primary is-pulled-right">
      Create
    </button>
    <badge-modal
      :show="showModal"
      :badgeData="context"
      @close="showModal = false">
    </badge-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import BadgeModal from './modal/Modal';

export default {
  name: 'badge-list',
  data() {
    return {
      showModal: false,
      context: null
    };
  },
  computed: mapState('badges', { badges: 'items' }),
  methods: {
    ...mapActions('badges', ['fetch']),
    create() {
      this.context = null;
      this.showModal = true;
    }
  },
  mounted() {
    this.fetch();
  },
  components: { BadgeModal }
};
</script>
