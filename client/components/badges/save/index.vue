<template>
  <div class="badge-form">
    <div class="is-pulled-right">
      <router-link :to="{ name: 'badge-list' }">
        <a class="button is-white has-text-link">Badge list</a>
      </router-link>
      <router-link v-if="id" :to="{ name: 'badge-create' }">
        <button class="btn-create button is-primary" type="button">Create</button>
      </router-link>
    </div>
    <h2 class="title is-4">{{ id ? 'Edit' : 'Create' }} Badge</h2>
    <form @submit.prevent="save">
      <div class="tile is-ancestor is-vertical">
        <div class="tile is-parent">
          <div class="tile is-child notification box">
            <p class="title"><span class="icon mdi mdi-clipboard-text-outline"></span>Basic info</p>
            <div class="columns is-8 is-variable">
              <div class="column">
                <div class="content">
                  <image-set
                    :image="badge.image"
                    :imageCaption="badge.imageCaption"
                    :imageAuthorIri="badge.imageAuthorIri"
                    @input="updateBadge">
                  </image-set>
                </div>
              </div>
              <div class="column">
                <div class="content">
                  <name :name="badge.name" @input="updateBadge"></name>
                  <description
                    :description="badge.description"
                    @input="updateBadge">
                  </description>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tile is-parent">
          <div class="tile is-child notification box">
            <p class="title"><span class="icon mdi mdi-clipboard-check-outline"></span>Criteria</p>
            <div class="content">
              <criteria-narrative
                :criteriaNarrative="badge.criteriaNarrative"
                @input="updateBadge">
              </criteria-narrative>
            </div>
          </div>
        </div>
        <div class="tile is-parent">
          <div class="tile is-child notification box">
            <p class="title"><span class="icon mdi mdi-tag-text-outline"></span>Badge Tags</p>
            <div class="content">
              <tags :tags="badge.tags" @input="updateBadge"></tags>
            </div>
          </div>
        </div>
        <div class="tile is-parent">
          <div class="tile is-child notification box">
            <p class="title">Submit</p>
            <div class="content">
              <div class="controls field is-grouped is-grouped-right">
                <button @click="reset" class="control button" type="button">Cancel</button>
                <button @click="save" class="control button is-primary" type="submit">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { withValidation } from '@/validation';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import CriteriaNarrative from './CriteriaNarrative';
import Description from './Description';
import ImageSet from './Image';
import isNaN from 'lodash/isNaN';
import Modal from '@/components/common/Modal';
import Name from './Name';
import Tags from './Tags';

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
    updateBadge(data) {
      Object.assign(this.badge, data);
    },
    validate() {
      return this.$validator.validateAll()
        .then(() => this.$validator.validate('image', this.badge.image))
        .then(() => isEmpty(this.vErrors.items));
    },
    save() {
      this.validate().then(isValid => {
        if (!isValid) return;
        this.saveBadge(this.badge);
      });
    },
    reset() {
      const { getBadge, id } = this;
      this.badge = id ? cloneDeep(getBadge(id)) : resetBadge();
    },
    initRoute() {
      if (isNaN(this.id)) return this.$router.push({ name: 'badge-list' });
      if (!this.id) return this.reset();
      this.get(this.id.toString()).then(() => this.reset())
        .catch(() => this.$router.push({ name: 'badge-list' }));
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
    CriteriaNarrative,
    Description,
    ImageSet,
    Modal,
    Name,
    Tags
  }
};
</script>

<style lang="scss" scoped>
.badge-form {
  margin-bottom: 100px;

  .tile.is-child {
    padding: 2rem 3rem;
  }

  .tile .content {
    padding: 0 2rem;
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
  .badge-form .tile .content {
      padding: 0;
  }
}
</style>
