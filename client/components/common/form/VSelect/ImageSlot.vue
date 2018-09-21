<template>
  <div class="option">
    <img v-if="image" :alt="alt || title" :src="image" class="image">
    <div class="desc">
      <div class="title">
        <b>{{ title }}</b>
      </div>
      <div class="small">{{ desc }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'image-slot',
  props: {
    alt: { type: String, default: null },
    desc: { type: String, default: null },
    image: { type: String, default: null },
    title: { type: String, required: true }
  }
};
</script>

<style lang="scss">
@import '~vue-multiselect/dist/vue-multiselect.min';
.option {
  display: flex;
  max-height: 70px;

  .image {
    max-width: 70px;
  }

  .desc {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 10px;

    .title {
      font-size: 16px;
      margin: 0;
    }

    .small {
      font-size: 13px;
      line-height: normal;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
