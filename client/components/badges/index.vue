<template>
  <div>
    <h1 class="title">Badges</h1>
    <button
      @click="create"
      class="btn-create button is-primary is-pulled-right">
      Create
    </button>
    <table class="table is-fullwidth is-hoverable">
      <thead>
        <th>Name</th>
        <th>Description</th>
        <th>Image</th>
        <th>Image caption</th>
        <th>Image author</th>
        <th>Criteria</th>
        <th>Tags</th>
        <th></th>
      </thead>
      <tbody>
        <tr v-for="badge in badges" :key="badge._cid">
          <td>{{ badge.name }}</td>
          <td>{{ badge.description }}</td>
          <td><img :src="badge.image" class="image"/></td>
          <td>{{ badge.imageCaption }}</td>
          <td>{{ badge.imageAuthorIri }}</td>
          <td>{{ badge.criteriaNarrative }}</td>
          <td>{{ badge.tags | readable }}</td>
          <td>
            <button @click="edit(badge)" class="button is-small is-pulled-right is-outlined">
              <span class="mdi mdi-pencil"></span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <save-badge
      :show="showModal"
      :badgeData="context"
      @close="showModal = false">
    </save-badge>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import SaveBadge from './save';

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
    },
    edit(badge) {
      this.context = badge;
      this.showModal = true;
    }
  },
  mounted() {
    this.fetch();
  },
  filters: {
    readable(tags) {
      return tags && tags.join(', ');
    }
  },
  components: { SaveBadge }
};
</script>

<style lang="scss" scoped>
td {
  width: 12.5%;
  max-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image {
  width: 28%;
}
</style>
