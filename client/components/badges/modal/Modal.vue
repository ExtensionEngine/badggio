<template>
  <modal :show="show" @close="close">
    <div class="badge-modal">
      <h2 class="title is-4">{{ badgeData ? 'Edit' : 'Create' }} Badge</h2>
      <form @submit.prevent="save">
        <navigation
          :steps="steps"
          :active="active"
          @activate="activate" />
        <component
          v-for="(step, index) in steps"
          v-show="isActive(step)"
          v-bind="badge"
          :key="index"
          :is="step"
          :badgeData="badgeData"
          @input="updateBadge" />
        <div class="controls field is-grouped is-grouped-right">
          <button @click="close" class="control button" type="button">Cancel</button>
          <button class="control button is-primary" type="submit">Save</button>
        </div>
      </form>
    </div>
  </modal>
</template>

<script>
import { mapActions } from 'vuex';
import { withValidation } from '@/validation';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
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
  name: 'badge-modal',
  mixins: [withValidation()],
  props: {
    show: { type: Boolean, default: false },
    badgeData: { type: Object, default() { return {}; } }
  },
  data() {
    return {
      active: navSteps[0],
      steps: navSteps,
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
      const inputs = Object.keys(resetBadge());
      inputs.forEach(key => {
        const isArray = Array.isArray(badge[key]);
        if (isArray) badge[key] = badge[key].map(tag => tag.trim());
        badge[key] = isArray ? badge[key].filter(tag => !!tag) : badge[key].trim();
        badge[key] = isEmpty(badge[key]) ? null : badge[key];
      });
    }
  },
  watch: {
    show(val) {
      if (!val) return;
      this.vErrors.clear();
      if (!isEmpty(this.badgeData)) {
        Object.assign(this.badge, pickBy(cloneDeep(this.badgeData)));
      }
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
