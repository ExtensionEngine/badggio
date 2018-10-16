<template>
  <div class="badge-form">
    <div class="buttons">
      <router-link :to="{ name: 'badge-list' }">
        <a class="button is-white has-text-link">Badge list</a>
      </router-link>
      <router-link v-if="id" :to="{ name: 'badge-create' }">
        <button class="btn-create button is-primary" type="button">Create</button>
      </router-link>
    </div>
    <v-form-group @submit="save">
      <template slot="title">
        <span v-if="id" class="mdi mdi-pencil"></span>
        <span v-else class="mdi mdi-plus-circle-outline"></span>
        <h2 class="is-inline">{{ id ? 'Edit' : 'Create' }} Badge</h2>
      </template>
      <template slot="content">
        <div class="tile is-ancestor is-vertical">
          <basic-info
            :description.sync="badge.description"
            :image.sync="badge.image"
            :imageAuthorIri.sync="badge.imageAuthorIri"
            :imageCaption.sync="badge.imageCaption"
            :name.sync="badge.name" />
          <criteria-narrative
            :criteriaNarrative.sync="badge.criteriaNarrative">
          </criteria-narrative>
          <tags :tags.sync="badge.tags"></tags>
        </div>
      </template>
      <template slot="footer">
        <div class="is-pulled-right">
          <div class="controls field is-grouped">
            <button @click="reset" class="control button" type="button">Cancel</button>
            <button class="control button is-primary" type="submit">Save</button>
          </div>
        </div>
      </template>
    </v-form-group>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { withValidation } from '@/validation';
import BasicInfo from './BasicInfo';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import CriteriaNarrative from './CriteriaNarrative';
import isNaN from 'lodash/isNaN';
import Tags from './Tags';
import VFormGroup from '@/components/common/form/VFormGroup';

const resetBadge = () => {
  return {
    name: '',
    description: '',
    image: '',
    criteriaNarrative: '',
    imageCaption: '',
    imageAuthorIri: '',
    tags: []
  };
};

const routes = {
  edit: id => ({ name: 'badge-edit', params: { id } }),
  list: () => ({ name: 'badge-list' })
};

export default {
  name: 'badge-form',
  mixins: [withValidation()],
  props: {
    id: { type: Number, default: null }
  },
  data() {
    return {
      badge: resetBadge()
    };
  },
  computed: mapGetters('badges', { getBadge: 'getById' }),
  methods: {
    ...mapActions('badges', { saveBadge: 'save', get: 'get' }),
    initRoute() {
      if (isNaN(this.id)) return this.$router.push(routes.list());
      if (!this.id) return this.reset();
      this.get(this.id.toString()).then(() => this.reset())
        .catch(() => this.$router.push(routes.list()));
    },
    reset() {
      const { id } = this;
      this.badge = id ? cloneDeep(this.getBadge(id)) : resetBadge();
    },
    save() {
      this.validate().then(isValid => {
        if (!isValid) return;
        this.saveBadge(this.badge).then(badge => {
          if (this.id) return;
          this.$router.push(routes.edit(badge.id));
        });
      });
    },
    validate() {
      return this.$validator.validateAll()
        .then(() => this.$validator.validate('image', this.badge.image))
        .then(() => isEmpty(this.vErrors.items));
    }
  },
  watch: {
    id(val) {
      this.vErrors.clear();
      this.initRoute();
    }
  },
  mounted() {
    this.initRoute();
  },
  components: {
    BasicInfo,
    CriteriaNarrative,
    Tags,
    VFormGroup
  }
};
</script>

<style lang="scss" scoped>
.badge-form {
  margin-bottom: 100px;
  display: relative;

  .buttons {
    justify-content: flex-end;
    margin-bottom: 0;
  }

  /deep/ .tile {
    .content {
      padding: 0 2rem;
    }

    &.is-child {
      padding: 2rem 3rem;
    }
  }

  /deep/ form {
    .title {
      font-size: 1.75rem;
      font-weight: 300;

      .icon {
        margin-right: 8px;
      }
    }

    .label {
      font-weight: 300;
    }
  }
}

@media (max-width: 1023px) {
  .badge-form /deep/ .tile .content {
      padding: 0;
  }
}
</style>
