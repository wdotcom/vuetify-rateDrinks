<template>
  <q-btn icon="add_circle" to="/createDrink" />
  <q-btn label="addRating" @click="addRating" />
  <div>
    <template v-if="tab === 'allDrinks'">
      <q-page class="q-pa-md">
        <q-list class="full-width" separator>
          <q-item v-for="drink in drinks" :key="drink.id" v-ripple>
            <div
              v-show="$q.localStorage.getItem('storedID') === drink.hostID"
              class="q-pa-md row items-start q-gutter-md"
            >
              <q-card class="my-card" flat>
                <q-card-section>
                  <div class="cursor.pointer text-h5 q-mb-xs">
                    <q-input filled v-model="drink.name" label="Drink Name">
                      <template v-slot:before>
                        <q-icon name="liquor" />
                      </template>
                    </q-input>
                  </div>

                  <div class="text-overline q-mb-xs">
                    <q-icon
                      name="support_agent"
                      size="30px"
                      color="grey-8"
                      class="q-mr-sm"
                    />
                    {{ drink.hostName }}
                  </div>

                  <div class="cursor.pointer q-mb-md">
                    <q-input
                      filled
                      v-model="drink.description"
                      label="drink Description"
                    >
                      <template v-slot:before>
                        <q-icon name="description" />
                      </template>
                    </q-input>
                  </div>

                  <div class="cursor.pointer">
                    <q-input
                      filled
                      v-model="drink.date"
                      label="drink Date"
                      mask="####/##/##"
                      hint="yyyy/mm/dd"
                    >
                      <template v-slot:before>
                        <q-icon name="event" />
                      </template>
                    </q-input>
                  </div>

                  <div class="cursor.pointer">
                    <q-input filled v-model="drink.time" label="drink Time">
                      <template v-slot:before>
                        <q-icon name="access_time" />
                      </template>
                    </q-input>
                  </div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                  <div class="q-pb-md">
                    <strong>Partiers:</strong>
                    <div
                      v-for="partiers in drink.approvedPartiers"
                      :key="partiers"
                    >
                      {{ partiers }},
                    </div>
                  </div>
                  <div v-if="drink.pendingPartiers.length > 0">
                    <strong>Partiers waiting for approval:</strong>
                    <div
                      v-for="pendingPartiers in drink.pendingPartiers"
                      :key="pendingPartiers"
                    >
                      {{ pendingPartiers }},
                    </div>
                    <q-btn
                      label="Approve Partiers"
                      @click="approvePartiersPages(drink)"
                    />
                  </div>
                  <div v-else>
                    <strong>Partiers waiting for approval:</strong>
                    <div>Nobody is waiting for approval.</div>
                  </div>
                </q-card-section>
                <q-separator />
                <q-card-section
                  ><div class="q-pa-md">
                    <q-option-group
                      v-model="drink.inProgress"
                      :options="options"
                      inline
                    />
                  </div>
                  <div class="row">
                    <div class="col">
                      <q-btn
                        flat
                        rounded
                        color="red"
                        size="lg"
                        icon="delete"
                        @click="notifyBeforeDeleteDrink(drink)"
                      />
                    </div>
                    <div class="col-8 text-center"></div>
                    <div class="col">
                      <q-space />
                      <q-btn
                        flat
                        rounded
                        dense
                        color="green"
                        size="lg"
                        icon="save"
                        @click="saveDrink(drink)"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- not a match ------------------------------->
            <div
              v-show="$q.localStorage.getItem('storedID') != drink.hostID"
              class="q-pa-md row items-start q-gutter-md"
            >
              <q-card class="my-card" flat bordered>
                <q-card-section class="q-pl-md">
                  <div class="text-h5 q-mt-sm q-mb-xs">
                    <q-icon name="liquor" />
                    {{ drink.name }}
                  </div>

                  <div class="text-overline">{{ drink.hostName }}</div>
                </q-card-section>

                <q-card-section class="q-pl-md">
                  <div class="text-body q-mt-sm q-mb-xs">
                    {{ drink.description }}
                  </div>
                  <div><q-icon size="30px" name="event" />{{ drink.date }}</div>
                  <div>
                    <q-icon size="30px" color="grey-8" name="access_time" />{{
                      drink.time
                    }}
                  </div>
                </q-card-section>
                <q-separator />

                <q-card-actions>
                  <div>
                    <q-btn icon="liquor" @click="showDrinks(drink)" />

                    <q-badge
                      v-if="drink.inProgress === 'inProgress'"
                      label="drink in progress"
                      color="light-green"
                    />
                    <q-badge
                      v-else-if="drink.inProgress === 'notStarted'"
                      label="drink has not started"
                      color="orange"
                    />
                    <q-badge v-else label="drink has completed" color="red" />
                  </div>
                </q-card-actions>
                <q-card-section>
                  <div
                    v-if="
                      drink.pendingIDs.includes(
                        this.$q.localStorage.getItem('storedID')
                      )
                    "
                  >
                    REQUEST PENDING
                  </div>
                  <div
                    v-else-if="
                      drink.approvedIDs.includes(
                        this.$q.localStorage.getItem('storedID')
                      )
                    "
                  >
                    Approved
                  </div>
                  <div v-else>
                    <q-btn
                      label="Add to my drinks  "
                      flat
                      icon="add_circle_outline"
                      @click="requestAccess(drink)"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Awaiting approval ------------------------->
          </q-item>
        </q-list>
      </q-page>
    </template>

    <template v-else-if="tab === 'thisPartyDrinks'">
      <q-page class="q-pa-md">
        <q-list class="full-width" separator>
          <q-item v-for="drink in thisPartyDrinks" :key="drink.id">
            <div
              v-show="
                $q.localStorage.getItem('storedID') === drink.drinkSupplierId
              "
              class="q-pa-md row items-start q-gutter-md"
            >
              <q-card class="my-card" flat>
                <q-card-section>
                  <div class="cursor.pointer text-h5 q-mb-xs">
                    <q-input
                      filled
                      v-model="drink.drinkName"
                      label="Drink Name"
                    >
                      <template v-slot:before>
                        <q-icon name="liquor" />
                      </template>
                    </q-input>
                  </div>

                  <div class="text-overline q-mb-xs">
                    <q-icon
                      name="support_agent"
                      size="30px"
                      color="grey-8"
                      class="q-mr-sm"
                    />
                    {{ drink.drinkSupplier }}
                  </div>

                  <div class="cursor.pointer q-mb-md">
                    <q-input
                      filled
                      v-model="drink.description"
                      label="Drink Description"
                    >
                      <template v-slot:before>
                        <q-icon name="description" />
                      </template>
                    </q-input>
                  </div>

                  <div class="text-overline q-mb-xs">
                    <q-icon
                      name="local_bar"
                      size="30px"
                      color="grey-8"
                      class="q-mr-sm"
                    />
                    Average Rating: {{ drink.ratingAvg }}
                  </div>
                  <div class="text-overline q-mb-xs">
                    <q-icon
                      name="local_bar"
                      size="30px"
                      color="green"
                      class="q-mr-sm"
                    />
                    My Current Rating: {{ drink.ratingAvg }}
                  </div>

                  <q-separator />

                  <div></div>
                  <div class="row">
                    <div class="col">
                      <q-btn
                        flat
                        rounded
                        color="red"
                        size="lg"
                        icon="delete"
                        @click="notifyBeforeDeleteDrink(drink)"
                      />
                    </div>
                    <div class="col-8 text-center"></div>
                    <div class="col">
                      <q-space />
                      <q-btn
                        flat
                        rounded
                        dense
                        color="green"
                        size="lg"
                        icon="save"
                        @click="saveDrink(drink)"
                      />
                    </div>
                  </div>
                  <div class="q-pt-lg">
                    <q-form @submit="submitRating(drink)">
                      <q-rating
                        v-model="formData.rating"
                        color="green"
                        size="lg"
                        icon="local_bar"
                        :max="10"
                      />
                      <!-- You can add readonly to the q-rating above to show but not be clickable -->
                      <q-btn label="Submit" type="submit" color="primary" />
                    </q-form>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- not a match ------------------------------->
            <div
              v-show="
                $q.localStorage.getItem('storedID') != drink.drinkSupplierId
              "
              class="q-pa-md row items-start q-gutter-md"
            >
              <q-card class="my-card" flat bordered>
                <q-card-section class="q-pl-md">
                  <div class="text-h5 q-mt-sm q-mb-sm">
                    <q-icon name="liquor" />
                    {{ drink.drinkName }}
                  </div>
                  <div class="q-mb-sm">
                    <q-icon name="support_agent" size="30px" />
                    {{ drink.drinkSupplier }}
                  </div>

                  <div class="q-mb-sm">
                    <q-icon name="description" size="30px" />
                    {{ drink.description }}
                  </div>
                  <div>
                    <q-icon name="local_bar" size="30px" />Average Rating:
                    {{ drink.ratingAvg }}
                  </div>
                </q-card-section>
                <q-separator />
              </q-card>
            </div>
          </q-item>
        </q-list>
      </q-page>
    </template>
    <template v-else>
      <q-page class="q-pa-md">
        <q-list class="full-width" separator>
          <q-item v-for="drink in drinks" :key="drink.id" v-ripple>
            <div
              v-show="$q.localStorage.getItem('storedID') === drink.hostID"
              class="q-pa-md row items-start q-gutter-md"
            >
              <q-card class="my-card" flat>
                <q-card-section>
                  <div class="cursor.pointer text-h5 q-mb-xs">
                    <q-input filled v-model="drink.name" label="drink Name">
                      <template v-slot:before>
                        <q-icon name="liquor" />
                      </template>
                    </q-input>
                  </div>

                  <div class="text-overline q-mb-xs">
                    <q-icon
                      name="support_agent"
                      size="30px"
                      color="grey-8"
                      class="q-mr-sm"
                    />
                    {{ drink.hostName }}
                  </div>
                  <!--    </q-card-section>

            <q-card-section class="q-pl-md"> -->
                  <div class="cursor.pointer q-mb-md">
                    <q-input
                      filled
                      v-model="drink.description"
                      label="drink Description"
                    >
                      <template v-slot:before>
                        <q-icon name="description" />
                      </template>
                    </q-input>
                  </div>

                  <div class="cursor.pointer">
                    <q-input
                      filled
                      v-model="drink.date"
                      label="drink Date"
                      mask="####/##/##"
                      hint="yyyy/mm/dd"
                    >
                      <template v-slot:before>
                        <q-icon name="event" />
                      </template>
                    </q-input>
                  </div>

                  <div class="cursor.pointer">
                    <q-input filled v-model="drink.time" label="drink Time">
                      <template v-slot:before>
                        <q-icon name="access_time" />
                      </template>
                    </q-input>
                  </div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                  <div class="q-pb-md">
                    <strong>Partiers:</strong>
                    <div
                      v-for="partiers in drink.approvedPartiers"
                      :key="partiers"
                    >
                      {{ partiers }},
                    </div>
                  </div>
                  <div v-if="drink.pendingPartiers.length > 0">
                    <strong>Partiers waiting for approval:</strong>
                    <div
                      v-for="pendingPartiers in drink.pendingPartiers"
                      :key="pendingPartiers"
                    >
                      {{ pendingPartiers }},
                    </div>
                    <q-btn
                      label="Approve Partiers"
                      @click="approvePartiersPages(drink)"
                    />
                  </div>
                  <div v-else>
                    <strong>Partiers waiting for approval:</strong>
                    <div>Nobody is waiting for approval.</div>
                  </div>
                </q-card-section>
                <q-separator />
                <q-card-section
                  ><div class="q-pa-md">
                    <q-option-group
                      v-model="drink.inProgress"
                      :options="options"
                      inline
                    />
                  </div>
                  <div class="row">
                    <div class="col">
                      <q-btn
                        flat
                        rounded
                        color="red"
                        size="lg"
                        icon="delete"
                        @click="notifyBeforeDeleteDrink(drink)"
                      />
                    </div>
                    <div class="col-8 text-center"></div>
                    <div class="col">
                      <q-space />
                      <q-btn
                        flat
                        rounded
                        dense
                        color="green"
                        size="lg"
                        icon="save"
                        @click="saveDrink(drink)"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- not a match ------------------------------->
          </q-item>
        </q-list>
      </q-page>
    </template>
  </div>
</template>

<script>
import { ref } from "vue";

import {
  collection,
  query,
  orderBy,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

import { auth, db } from "boot/firebase";

export default {
  name: "DrinksComponent",
  props: ["tab"],

  setup() {
    return {
      rating: ref(7),
    };
  },
  data() {
    return {
      drinks: [],
      thisPartyDrinks: [],
      name: "Sandi",
      formData: {
        rating: "",
      },
    };
  },
  methods: {
    submitRating(drink) {
      let newRatingResult = {
        ratingName: this.$q.localStorage.getItem("storedName"),
        ratingValue: this.formData.rating,
      };
      this.thisPartyDrinks.unshift(newRatingResult);

      const recordDocuments = getDoc(
        doc(
          collection(
            db,
            "parties",
            this.$q.sessionStorage.getItem("partyID"),
            "drinks",
            drink.id,
            "Ratings"
          )
        )
      );
      if (recordDocuments) {
      }

      setDoc(
        doc(
          collection(
            db,
            "parties",
            this.$q.sessionStorage.getItem("partyID"),
            "drinks",
            drink.id,
            "Ratings"
          ),
          this.$q.localStorage.getItem("storedID")
        ),
        newRatingResult
      );
    },

    addRating() {
      const restaurantRef = db
        .collection("restaurants")
        .doc("arinell-pizza")
        .collection("ratings")
        .get();
      // Create a reference for a new rating, for use inside the transaction
      var ratingRef = restaurantRef.collection("ratings").doc();

      // In a transaction, add the new rating and update the aggregate totals
      return db.runTransaction((transaction) => {
        return transaction.get(restaurantRef).then((res) => {
          if (!res.exists) {
            throw "Document does not exist!";
          }

          // Compute new number of ratings
          var newNumRatings = res.data().numRatings + 1;

          // Compute new average rating
          var oldRatingTotal = res.data().avgRating * res.data().numRatings;
          var newAvgRating = (oldRatingTotal + 1.5) / newNumRatings;

          // Commit to Firestore
          transaction.update(restaurantRef, {
            numRatings: newNumRatings,
            avgRating: newAvgRating,
          });
          transaction.set(ratingRef, { rating: rating });
        });
      });
    },
    approvePartiersPages(drink) {
      this.$q.sessionStorage.set("drinkID", drink.id);
      this.$q.sessionStorage.set("drinkName", drink.name);
      this.$q.sessionStorage.set("drinkHostName", drink.hostName);
      this.$q.sessionStorage.set("drinkDescription", drink.description);
      this.$q.sessionStorage.set("drinkDate", drink.date);
      this.$q.sessionStorage.set("drinkTime", drink.time);
      this.$q.sessionStorage.set("drinkInProgress", drink.inProgress);
      let urlLink = "/showDrink/" + drink.id;
      this.$router.push(urlLink);
    },

    showDrinks(drink) {
      const partiersPending = query(collection(db, "drinks", drink, "pending"));
      const unsubscribe = onSnapshot(partiersPending, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let drinkChange = change.doc.data();
          drinkChange.id = change.doc.id;

          this.partiersPend.push(drinkChange.name);
        });
      });
    },

    notifyBeforeDeleteDrink(drink) {
      this.$q.notify({
        type: "negative",
        message: "Are you sure you want to delete? This cannot be undone.",
        avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
        actions: [
          {
            color: "white",
            icon: "delete",
            label: "YES - Delete it.",
            handler: () => {
              this.deleteDrink(drink);
            },
          },
          {
            color: "white",
            icon: "highlight_off",
            label: "NO! Do NOT delete it.",
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
    saveDrink(drink) {
      updateDoc(doc(db, "drinks", drink.id), {
        description: drink.description,
        name: drink.name,
        inProgress: drink.inProgress,
        date: drink.date,
      });
    },
  },
  mounted() {
    const thisPartyDrinks = query(
      collection(
        db,
        "parties",
        this.$q.sessionStorage.getItem("partyID"),
        "drinks"
      ),
      orderBy("drinkName", "asc")
    );
    const unsubscribe = onSnapshot(thisPartyDrinks, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let drinkChange = change.doc.data();
        drinkChange.id = change.doc.id;
        if (change.type === "added") {
          this.thisPartyDrinks.unshift(drinkChange);
        }
        if (change.type === "modified") {
          let index = this.thisPartyDrinks.findIndex(
            (drink) => drink.id === drinkChange.id
          );
          Object.assign(this.thisPartyDrinks[index], drinkChange);
        }
        if (change.type === "removed") {
          let index = this.thisPartyDrinks.findIndex(
            (drink) => drink.id === drinkChange.id
          );
          this.thisPartyDrinks.splice(index, 1);
        }
      });
    });
  },
};
</script>
<style lang="sass">
.my-card
  width: 100%
  max-width: 500px
</style>
