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
                    :criteriaNarrative="badge.criteriaNarrative"
                    :imageCaption="badge.imageCaption"
                    :imageAuthorIri="badge.imageAuthorIri">
                  </image-set>
                </div>
              </div>
              <div class="column">
                <p class="subtitle">Name and description</p>
                <div class="content">
                  <name :name="badge.name"></name>
                  <description :description="badge.description"></description>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tile is-parent">
          <div class="tile is-child notification box">
            <p class="title">Citeria</p>
            <div class="content">
              <criteria-narrative :criteriaNarrative="badge.criteriaNarrative">
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
                  <tags :tags="badge.tags" @input="updateBadge"></tags>
                </div>
              </div>
            </div>
            <div class="tile is-parent">
              <div class="tile is-child notification box">
                <p class="title">Submit</p>
                <div class="content">
                  <div class="controls field is-grouped is-grouped-right">
                    <button @click="close" class="control button" type="button">Cancel</button>
                    <button class="control button is-primary" type="submit">Save</button>
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
import { mapActions } from 'vuex';
import { withValidation } from '@/validation';
import cloneDeep from 'lodash/cloneDeep';
import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';
import CriteriaNarrative from './CriteriaNarrative';
import Description from './Description';
import ImageSet from './Image';
import Modal from '@/components/common/Modal';
import Name from './Name';
import Navigation from './Navigation';
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
const navSteps = ['name', 'description', 'imageSet', 'criteriaNarrative', 'tags'];

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
  methods: {
    ...mapActions('badges', { saveBadge: 'save' }),
    isActive(step) {
      return step === this.active;
    },
    resetActive() {
      return navSteps[0];
    },
    activate(step) {
      this.active = step;
    },
    updateBadge(data) {
      Object.assign(this.badge, data);
    },
    close() {
      this.active = this.resetActive();
      this.badge = resetBadge();
      this.$emit('close');
    },
    validate() {
      return this.$validator.validateAll()
        .then(() => this.$validator.validate('image', this.badge.image))
        .then(() => isEmpty(this.vErrors.items));
    },
    save() {
      this.validate().then(isValid => {
        if (!isValid) return;
        this.cleanBadge(this.badge);
        this.saveBadge(this.badge);
        this.close();
      });
    },
    cleanBadge(badge) {
      Object.keys(resetBadge()).forEach(key => {
        const val = badge[key];
        badge[key] = Array.isArray(val)
          ? compact(val.map(it => it.trim()))
          : val.trim();
      });
    }
  },
  watch: {
    show(val) {
      if (!val) return;
      this.vErrors.clear();
      if (!isEmpty(this.badgeData)) this.badge = cloneDeep(this.badgeData);
    }
  },
  components: {
    CriteriaNarrative,
    Description,
    ImageSet,
    Modal,
    Name,
    Navigation,
    Tags
  }
};
</script>

<style lang="scss" scoped>
.badge-form {
  margin-bottom: 100px;
}
</style>
