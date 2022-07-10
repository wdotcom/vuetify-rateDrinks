<template>
  <q-page class="flex constrain-more">
    <q-card class="full-width">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="hostingParties" label="Hosting" />
        <q-tab name="attendingParties" label="Attending" />
        <q-tab name="allParties" label="All Parties" />
      </q-tabs>

      <q-tab-panels v-model="tab">
        <q-tab-panel name="hostingParties">
          <PartiesComponent :tab="tab" />
        </q-tab-panel>

        <q-tab-panel name="attendingParties">
          <PartiesComponent :tab="tab" />
        </q-tab-panel>
        <q-tab-panel name="allParties">
          <PartiesComponent :tab="tab" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import PartiesComponent from "components/PartiesComponent";

export default {
  components: { PartiesComponent },
  data() {
    return {
      tab: "attendingParties",
    };
  },
};
</script>
<style lang="scss"></style>
