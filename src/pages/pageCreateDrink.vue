<template>
  <q-footer elevated>
    <q-toolbar>
      <q-btn flat round color="red-4" size="lg" icon="cancel" to="/showParty" />
      <q-space />
      <q-btn
        flat
        round
        color="green-4"
        size="lg"
        @click="saveDrink"
        icon="save"
      />
    </q-toolbar>
  </q-footer>
  <q-page>
    <div class="col-8 text-h6 text-center">
      <strong>Let's create a new drink!</strong>
    </div>

    <q-form @submit="saveDrink">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            v-model="formData.drinkName"
            placeholder="Name of the drink"
            counter
            type="text"
            maxlength="50"
          />

          <q-input
            autogrow
            class="new-drink"
            type="text"
            bottom-slots
            v-model="formData.drinkDescript"
            placeholder="Drink Description?"
            counter
            maxlength="280"
          />

          <div class="col-shrink"></div>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
//import { formatDistance } from "date-fns";
import { collection, doc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "boot/firebase";
import { ref } from "vue";
export default defineComponent({
  name: "PageCreateDrink",
  data() {
    return {
      formData: {
        drinkName: "",

        drinkDescript: "",
      },

      group: ref("notStarted"),

      drinkDescript: "", //Need this for the text counter to update
      drinks: [],
    };
  },
  methods: {
    saveDrink() {
      if (!this.formData.drinkName) {
        this.$q.notify("Please enter a name for the drink.");
      } else {
        let newDrink = {
          supplier: this.storedName,
          supplierId: this.storedID,
          name: this.formData.drinkName,
          description: this.formData.drinkDescript,
          edit: false,
          currentDrink: false,
          display: false,
          numRatings: 0,
          ratingAvg: 0,
        };
        this.drinks.unshift(newDrink);
        addDoc(collection(db, "Parties", this.partyID, "Drinks"), newDrink);

        this.formData.drinkName = "";
        this.formData.drinkDescript = "";

        this.$router.push("/showParty");
      }
    },
    notifyBeforeDeleteDrink(drink) {
      this.$q.notify({
        message: "Are you sure you want to delete? This cannot be undone.",
        color: "red",
        avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
        actions: [
          {
            label: "YES - Delete it.",
            color: "yellow",
            handler: () => {
              // this.deleteParty(drink);
            },
          },
          {
            label: "NO! Do NOT delete it.",
            color: "white",
            handler: () => {
              /* ... */
            },
          },
        ],
      });
    },
    deleteDrink(drink) {
      deleteDoc(doc(db, "drinks", drink.id));
    },
  },
  mounted() {
    this.storedID = this.$q.localStorage.getItem("storedID");
    this.storedName = this.$q.localStorage.getItem("storedName");
    this.partyID = this.$q.sessionStorage.getItem("partyID");
  },
});
</script>

<style lang="sass">
.new-drink
  textarea
    font-size: 14px
    line-height: 1.4 !important

.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4

.drink-content
  white-space: pre-line

.drink-icons
  margin-left: -5px

.drink:not(:first-child)
  border-top: 1px solid rgba(0,0,0,12)
</style>
