<template>
  <modal :show="show" @close="close">
    <div class="badge-modal">
      <h2 class="title is-4">{{ badgeData ? 'Edit' : 'Create' }} Badge</h2>
      <form @submit.prevent="save">
        <navigation :steps="steps" :active="active" @activate="activate" />
        <component
          v-for="(step, index) in steps"
          v-show="isActive(step)"
          :key="index"
          :is="step"
          :badgeData="badgeData"
          v-bind="badge"
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
import head from 'lodash/head';
import CriteriaNarrative from './steps/CriteriaNarrative';
import Description from './steps/Description';
import ImageSet from './steps/image/ImageSet';
import isEmpty from 'lodash/isEmpty';
import Modal from '@/components/common/Modal';
import Name from './steps/Name';
import Navigation from './Navigation';
import request from '@/api/request';
import Tags from './steps/Tags';

const resetBadge = () => {
  return {
    name: '',
    description: '',
    image: '',
    criteriaNarrative: '',
    imageCaption: '',
    imageAuthorIri: '',
    tags: ['']
  };
};
const navSteps = ['Name', 'Description', 'ImageSet', 'CriteriaNarrative', 'Tags'];

export default {
  name: 'badge-modal',
  mixins: [withValidation()],
  props: {
    show: { type: Boolean, default: false },
    badgeData: { type: Object, default() { return {}; } }
  },
  data() {
    return {
      active: head(navSteps),
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
      return head(navSteps);
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
    save() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        // this.saveBadge(this.badge);
        this.close();
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
  mounted() {
    if (this.$validator.rules['unique-name']) return;
    this.$validator.extend('unique-name', {
      getMessage: field => `The ${field} is not unique.`,
      validate: (name, [badgeData]) => {
        if (badgeData && name === badgeData.name) return true;
        return request.get('/badges', { params: { name } })
          .then(res => ({ valid: isEmpty(res.data.data) }));
      }
    });
  },
  components: {
    CriteriaNarrative,
    Description,
    ImageSet,
    Modal,
    Name,
    Navigation,
    Tags
  },
  inject: ['$validator']
};
</script>
