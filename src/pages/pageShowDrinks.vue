<template>
  <q-page class="flex q-pa-md">
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
        <q-tab name="thisPartyDrinks" label="This Party" />
        <q-tab name="myDrinks" label="My Drinks" />
        <q-tab name="allDrinks" label="All Drinks" />
      </q-tabs>

      <q-tab-panels v-model="tab">
        <q-tab-panel name="myDrinks">
          <DrinksComponent :tab="tab" />
        </q-tab-panel>

        <q-tab-panel name="allDrinks">
          <DrinksComponent :tab="tab" />
        </q-tab-panel>

        <q-tab-panel name="thisPartyDrinks">
          <DrinksComponent :tab="tab" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import DrinksComponent from "components/DrinksComponent";

export default {
  components: { DrinksComponent },
  data() {
    return {
      tab: "myDrinks",
    };
  },
};
</script>
