<template>
  <q-page>
    <div class="row">
      <div class="col-sm-8">
        <div class="text-h5">
          <q-icon name="liquor" />

          {{ this.partyName }}
        </div>
        <div class="q-pb-md">
          <q-badge
            v-if="this.partyInProgress === 'inProgress'"
            label="Party in progress"
            color="light-green"
          />
          <q-badge
            v-else-if="this.partyInProgress === 'notStarted'"
            label="Party has not started"
            color="orange"
          />
          <q-badge v-else label="Party has completed" color="red" />
          <q-badge v-if="amHost" label="HOST" color="light-blue" />
          <q-badge v-else label="GUEST" color="light-blue" />
        </div>
        <div class="text-overline q-pb-sm">
          <q-icon name="support_agent" size="20px" class="q-pr-sm" />{{
            this.partyHost
          }}
        </div>
        <div>
          <strong>Description: </strong>
          <div class="text-body q-mb-sm">
            {{ this.partyDescription }}
          </div>
        </div>
        <div class="q-pb-md">
          <q-icon size="20px" name="event" />{{ this.partyDate }}

          <q-icon
            size="20px"
            class="q-pl-lg"
            color="grey-8"
            name="access_time"
          />{{ this.partyTime }}
        </div>

        <q-icon size="20px" name="people" class="q-pr-md" /> Partiers

        <q-btn
          color="grey"
          round
          flat
          dense
          :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expanded = !expanded"
        />

        <q-slide-transition>
          <div v-show="expanded" class="q-pb-md">
            <q-separator />

            <div class="q-pb-md">
              <strong>Approved Partiers</strong>
              <div
                class="full-width"
                v-for="approvedPartier in approvedPartiers"
                :key="approvedPartier.id"
              >
                {{ approvedPartier.name }}
              </div>
            </div>
            <div v-if="pendingPartiers">
              <strong> Partiers Awaiting approval:</strong>
              <q-list class="full-width">
                <q-item
                  v-for="pendingPartier in pendingPartiers"
                  :key="pendingPartier.id"
                >
                  <div class="text-overline">
                    {{ pendingPartier.name }}
                  </div>
                  <q-btn
                    flat
                    rounded
                    color="red"
                    size="sm"
                    icon="delete"
                    @click="denyPartier(pendingPartier)"
                  />
                  <q-btn
                    flat
                    rounded
                    color="green"
                    size="sm"
                    icon="add_task"
                    @click="approvePartier(pendingPartier)"
                  />
                </q-item>
              </q-list>
            </div>
            <div v-else>
              <strong>Partiers Awaiting Approval</strong>
              <div>No partiers need to be approved.</div>
            </div>
          </div>
        </q-slide-transition>

        <q-separator />

        <div class="bg-grey-5">
          <q-icon name="wine_bar" size="20px" />
          <strong>Drink Up!</strong>
        </div>

        <div class="q-ml-sm q-mr-sm">
          <q-card
            v-for="drink in drinks"
            :key="drink.id"
            class="q-pl-sm q-pr-sm q-mt-md q-mb-md"
          >
            <q-card-section horizontal>
              <div class="col-10 q-pl-xs">
                <div v-if="drink.edit === false" class="q-pb-lg">
                  <div
                    v-if="
                      drink.display == true ||
                      this.amHost ||
                      drink.supplierId == this.storedID
                    "
                  >
                    <q-item-label
                      ><q-icon
                        name="liquor"
                        size="20px"
                        class="q-pr-sm"
                      /><strong>{{ drink.name }}</strong></q-item-label
                    >
                    <q-item-label>by {{ drink.supplier }}</q-item-label>
                    <q-item-label class="q-pt-md"
                      ><strong>Description</strong></q-item-label
                    >
                    <q-item-label>{{ drink.description }}</q-item-label>
                  </div>
                  <div v-else>
                    <strong>Shhh!</strong> <br />
                    {{ drink.supplier }} is keeping this drink a secret!
                  </div>
                </div>
                <div v-else class="q-pb-sm">
                  <q-input filled v-model="drink.name" label="Drink Name">
                    <template v-slot:before>
                      <q-icon name="liquor" />
                    </template>
                  </q-input>

                  <q-input
                    filled
                    autogrow
                    type="textarea"
                    v-model="drink.description"
                    label="Drink Description"
                  >
                    <template v-slot:before>
                      <q-icon name="description" />
                    </template>
                  </q-input>
                </div>
                <div>
                  <strong>Drink Avg: </strong
                  >{{ drink.numRatings > 0 ? drink.ratingAvg : "No Ratings" }}
                </div>
                <div></div>
              </div>
              <q-separator vertical />

              <q-card-actions vertical>
                <div v-if="!this.amHost">
                  <q-icon
                    v-if="
                      drink.supplierId != this.storedID &&
                      drink.display === false
                    "
                    size="20px"
                    color="grey-8"
                    name="visibility_off"
                  />
                </div>
                <div>
                  <q-btn
                    flat
                    rounded
                    size="md"
                    icon="thumbs_up_down"
                    :color="drink.currentDrink ? 'green' : 'grey-4'"
                    :disabled="drink.currentDrink ? false : true"
                    @click="rateDrink(drink)"
                  />
                </div>
                <div v-show="this.amHost">
                  <div class="text-caption">
                    Active:
                    <q-btn
                      flat
                      dense
                      size="15px"
                      @click="activateDrink(drink)"
                      :icon="drink.currentDrink ? 'toggle_on' : 'toggle_off'"
                      :color="drink.currentDrink ? 'light-green-5' : 'grey-4'"
                    />
                  </div>
                </div>
                <div v-show="this.amHost || drink.supplierId == this.storedID">
                  <q-btn
                    flat
                    rounded
                    color="green"
                    size="md"
                    :icon="drink.display ? 'visibility' : 'visibility_off'"
                    @click="displayDrink(drink)"
                  />

                  <q-btn
                    v-if="drink.edit === false"
                    flat
                    color="grey-9"
                    icon="edit"
                    size="md"
                    @click="editDrink(drink)"
                  />
                  <q-btn
                    v-else
                    flat
                    size="md"
                    icon="save"
                    color="grey-9"
                    @click="saveDrink(drink)"
                  /><q-btn
                    icon="delete"
                    @click="notifyBeforeDeleteDrink(drink)"
                    align="right"
                    flat
                    color="red"
                  />
                </div>
              </q-card-actions>
            </q-card-section>
          </q-card>
          <!--------------------------------------------------------------------------->
        </div>
      </div>
      <div class="col-4 large-screen-only bg-grey-4">
        <div class="q-ml-sm">
          <div>
            <strong>MY RATINGS</strong>
          </div>
          <div v-if="this.myAvgRating > 0">
            My Average for this party: {{ this.myAvgRating }}
          </div>

          <div v-else>No Ratings</div>

          <q-item>
            <q-list separator>
              <q-item v-for="myRating in myRatings" :key="myRating.id">
                <q-item-section>
                  <q-item-label
                    ><strong>{{ myRating.name }}</strong
                    >: {{ myRating.value }}</q-item-label
                  >
                </q-item-section></q-item
              ></q-list
            ></q-item
          >
        </div>
      </div>

      <div class="col-12 small-screen-only bg-grey-4">
        <div>
          <div>
            <strong>MY RATINGS</strong>
          </div>
          <div v-if="this.myAvgRating > 0">
            My Average for this party: {{ this.myAvgRating }}
          </div>

          <div v-else>No Ratings</div>

          <q-item>
            <q-list separator>
              <q-item v-for="myRating in myRatings" :key="myRating.id">
                <q-item-section>
                  <q-item-label
                    ><strong>{{ myRating.name }}</strong
                    >: {{ myRating.value }}</q-item-label
                  >
                </q-item-section></q-item
              ></q-list
            ></q-item
          >
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, defineComponent } from "vue";

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
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { db } from "boot/firebase";

export default {
  name: "PartyComponent",

  setup() {},
  data() {
    return {
      expanded: ref(false),
      partyID: "",
      partyName: null,
      partyDescription: null,
      partyDate: null,
      partyTime: null,
      partyHost: null,
      partyHostID: null,
      partyInProgress: null,
      storedID: null,
      myRatings: [],
      myAvgRating: 0,
      amHost: false,
      party: {
        name: null,
        description: null,
        time: null,
        date: null,
        inProgress: null,
        host: null,
      },

      drinks: [],
      partyInfo: [],
      partiers: [],
      myAvg: [],

      approvedPartiers: [],
      pendingPartiers: [],

      date: ref("2021/05/01"),
      name: "Sandi",

      options: [
        {
          label: "Not started",
          value: "notStarted",
          color: "orange",
        },
        {
          label: "In Progress",
          value: "inProgress",
          color: "green",
        },
        {
          label: "Completed",
          value: "completed",
          color: "red",
        },
      ],
    };
  },
  methods: {
    editDrink(drink) {
      drink.edit = true;
    },
    saveDrink(drink) {
      drink.edit = false;

      updateDoc(doc(db, "Parties", this.partyID, "Drinks", drink.id), {
        description: drink.description,
        name: drink.name,
      });
    },
    activateDrink(drink) {
      updateDoc(doc(db, "Parties", this.partyID, "Drinks", drink.id), {
        currentDrink: !drink.currentDrink,
      });
      if (drink.display === false) {
        updateDoc(doc(db, "Parties", this.partyID, "Drinks", drink.id), {
          display: true,
        });
        this.$q.notify("Drink information is now viewable to all partiers.");
      }
    },
    displayDrink(drink) {
      updateDoc(doc(db, "Parties", this.partyID, "Drinks", drink.id), {
        display: !drink.display,
      });
      if (drink.display === false) {
        this.$q.notify("Drink information is now viewable to all partiers.");
      } else {
        this.$q.notify(
          "Drink information is a secret from everyone but the host."
        );
      }
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
      deleteDoc(doc(db, "Parties", this.partyID, "Drinks", drink.id));
    },
    rateDrink(drink) {
      this.$q.sessionStorage.set("drinkID", drink.id);
      this.$q.sessionStorage.set("drinkName", drink.name);
      this.$q.sessionStorage.set("drinkDescription", drink.description);
      this.$q.sessionStorage.set("drinkSupplier", drink.supplier);
      this.$q.sessionStorage.set("drinkRatingAvg", drink.ratingAvg);
      this.$router.push("/rateDrink");
    },

    denyPartier(pendingPartier) {
      deleteDoc(doc(db, "Parties", this.partyID, "pending", pendingPartier.id));
    },
    approvePartier(pendingPartier) {
      updateDoc(doc(db, "users", pendingPartier.id), {
        Parties: arrayUnion(this.partyID),
      });
      updateDoc(doc(db, "Parties", this.partyID), {
        approvedPartiers: arrayUnion(pendingPartier.name),
        approvedIDs: arrayUnion(pendingPartier.id),
        pendingIDs: arrayRemove(pendingPartier.id),
        pendingPartiers: arrayRemove(pendingPartier.name),
      });
      setDoc(doc(db, "Parties", this.partyID, "approved", pendingPartier.id), {
        name: pendingPartier.name,
      });

      deleteDoc(doc(db, "Parties", this.partyID, "pending", pendingPartier.id));
    },
  },

  mounted() {
    this.storedID = this.$q.localStorage.getItem("storedID");
    this.partyID = this.$q.sessionStorage.getItem("partyID");
    this.partyHost = this.$q.sessionStorage.getItem("partyHost");
    this.partyName = this.$q.sessionStorage.getItem("partyName");
    this.partyDate = this.$q.sessionStorage.getItem("partyDate");
    this.partyTime = this.$q.sessionStorage.getItem("partyTime");
    this.partyDescription = this.$q.sessionStorage.getItem("partyDescription");
    this.partyInProgress = this.$q.sessionStorage.getItem("partyInProgress");

    this.hostID = this.$q.sessionStorage.getItem("partyHostID");
    if (this.storedID === this.hostID) {
      this.amHost = true;
    } else {
      this.amHost = false;
    }

    onSnapshot(
      doc(db, "users", this.storedID, "Parties", this.partyID),
      (doc) => {
        this.myAvgRating = doc.data().ratingAvg;
      }
    );
    const drinks = query(
      collection(db, "Parties", this.partyID, "Drinks"),
      orderBy("ratingAvg", "asc")
    );
    // const unsubscribe =
    onSnapshot(drinks, (snapshot) => {
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

    const myRatings = query(
      collection(
        db,
        "users",
        this.storedID,
        "Parties",
        this.partyID,
        "Ratings"
      ),
      orderBy("value", "asc")
    );
    // const unsubscribe =
    onSnapshot(myRatings, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let myRatingChange = change.doc.data();
        myRatingChange.id = change.doc.id;
        if (change.type === "added") {
          this.myRatings.unshift(myRatingChange);
        }
        if (change.type === "modified") {
          let index = this.myRatings.findIndex(
            (myRating) => myRating.id === myRatingChange.id
          );
          Object.assign(this.myRatings[index], myRatingChange);
        }
      });
    });

    const pendingPartiers = query(
      collection(db, "Parties", this.partyID, "pending"),
      orderBy("name", "asc")
    );
    // const unsubscribe =
    onSnapshot(pendingPartiers, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let partyChange = change.doc.data();
        partyChange.id = change.doc.id;
        if (change.type === "added") {
          this.pendingPartiers.unshift(partyChange);
        }
        if (change.type === "modified") {
          let index = this.pendingPartiers.findIndex(
            (pendingPartier) => pendingPartier.id === partyChange.id
          );
          Object.assign(this.pendingPartiers[index], partyChange);
        }
        if (change.type === "removed") {
          let index = this.pendingPartiers.findIndex(
            (pendingPartier) => pendingPartier.id === partyChange.id
          );
          this.pendingPartiers.splice(index, 1);
        }
      });
    });
    const approvedPartiers = query(
      collection(db, "Parties", this.partyID, "approved"),
      orderBy("name", "asc")
    );
    //unsubscribe =
    onSnapshot(approvedPartiers, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let partierChange = change.doc.data();
        partierChange.id = change.doc.id;
        if (change.type === "added") {
          this.approvedPartiers.unshift(partierChange);
        }
        if (change.type === "modified") {
          let index = this.approvedPartiers.findIndex(
            (approvedPartier) => approvedPartier.id === partierChange.id
          );
          Object.assign(this.approvedPartiers[index], partierChange);
        }
        if (change.type === "removed") {
          let index = this.approvedPartiers.findIndex(
            (approvedPartier) => approvedPartier.id === partierChange.id
          );
          this.approvedPartiers.splice(index, 1);
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
