<template>
  <q-page class="flex q-pa-md constrain">
    <q-card class="full-width">
      <PartyComponent />
    </q-card>
  </q-page>
</template>

<script>
import PartyComponent from "components/PartyComponent";

export default {
  components: { PartyComponent },
  setup() {},
  data() {
    return {};
  },
};
</script>
<style lang="scss"></style>
