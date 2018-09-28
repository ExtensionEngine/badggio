<template>
  <div>
    <router-link :to="{ name: 'badge-create' }">
      <button
        class="btn-create button is-primary is-pulled-right">
        Create
      </button>
    </router-link>
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
            <router-link :to="{ name: 'badge-edit', params: { id: badge.id } }">
              <button class="button is-small is-pulled-right is-outlined">
                <span class="mdi mdi-pencil"></span>
              </button>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'badge-list',
  computed: mapState('badges', { badges: 'items' }),
  filters: {
    readable(tags) {
      return tags && tags.join(', ');
    }
  }
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
