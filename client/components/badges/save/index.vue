<template>
  <div class="badge-form">
    <h2 class="title is-4">{{ id ? 'Edit' : 'Create' }} Badge</h2>
    <form @submit.prevent="save">
      <div class="tile is-ancestor is-vertical">
        <div class="tile is-parent">
          <div class="tile is-child notification box">
            <div class="columns">
              <div class="column">
                <p class="title">Basic info</p>
                <p class="subtitle">Image data</p>
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
                <p class="subtitle">Name and description</p>
                <div class="content">
                  <name :name="badge.name" @input="updateBadge"></name>
                  <description
                    :description="badge.description"
                    @input="updateBadge"></description>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tile is-parent">
          <div class="tile is-child notification box">
            <p class="title">Citeria</p>
            <div class="content">
              <criteria-narrative
                :criteriaNarrative="badge.criteriaNarrative"
                @input="updateBadge">
              </criteria-narrative>
            </div>
          </div>
        </div>
        <div class="tile">
          <div class="tile">
            <div class="tile is-parent">
              <div class="tile is-child notification box">
                <p class="title">Badge Tags</p>
                <div class="content">
                  <tags
                    :tags="badge.tags"
                    :validate="{ min: 2, unique: badge.tags }"
                    @input="updateBadge">
                  </tags>
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
}
</style>
