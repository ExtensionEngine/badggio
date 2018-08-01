<template>
  <div>
    <h1 class="title">Assertions</h1>
    <recipient-select></recipient-select>
  </div>
</template>

<script>
import RecipientSelect from '../recipients/Select';

export default {
  name: 'assertion-list',
  components: { RecipientSelect }
};
</script>
