<template>
  <q-page class="flex q-pa-md">
    <q-list class="full-width" separator>
      <q-item
        v-for="drink in drinks"
        :key="drink.id"
        to="/chat"
        clickable
        v-ripple
      >
        <q-item-section>
          <q-item-label>{{ drink.name }} </q-item-label>
          <q-item-label>{{ drink.supplier }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

import { db } from "boot/firebase";

export default defineComponent({
  data() {
    return {
      users: [],
    };
  },
  methods: {},
  mounted() {
    this.partyID = this.$q.sessionStorage.getItem("partyID");
    const drinks = query(
      collection(db, "parties", this.partyID, "ratings"),
      orderBy("name", "asc")
    );
    const unsubscribe = onSnapshot(users, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let drinkChange = change.doc.data();
        drinkChange.id = change.doc.id;
        if (change.type === "added") {
          this.drinks.unshift(drinkChange);
        }
        if (change.type === "modified") {
          let index = this.drinks.findIndex(
            (drink) => drink.id === drinkChange.id
          );
          Object.assign(this.drinks[index], drinkChange);
        }
        if (change.type === "removed") {
          let index = this.drinks.findIndex(
            (drink) => drink.id === drinkChange.id
          );
          this.drinks.splice(index, 1);
        }
      });
    });
  },
});
</script>
