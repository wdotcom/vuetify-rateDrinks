<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-12 col-sm-8">
        <div class="text-h5 q-mt-sm q-mb-xs">
          <q-icon name="liquor" />
          {{ this.drinkName }}
        </div>

        <div class="text-overline">
          {{ this.$q.sessionStorage.getItem("drinkSupplier") }}
        </div>

        <strong>Description: </strong>
        <div class="text-body q-mb-sm">
          {{ this.$q.sessionStorage.getItem("drinkDescription") }}
        </div>

        <q-separator />
        <div class="q-pa-md">
          <q-form @submit="submitRating" class="q-gutter-md">
            <q-input
              maxlength="3"
              clearable
              clear-icon="close"
              style="max-width: 200px"
              v-model.number="formData.myRating"
            >
              <template v-slot:before>
                <q-icon name="thumbs_up_down" />
              </template>

              <template v-slot:hint> Enter Rating </template>

              <template v-slot:after>
                <q-btn
                  round
                  dense
                  flat
                  icon="save"
                  type="submit"
                  color="green"
                  @click="submitRating(this.formData.myRating)"
                />
              </template>
            </q-input>
          </q-form>
        </div>
        <q-separator />
        <div class="row">
          <div class="col"><strong>Ratings</strong></div>
          <div><q-space /></div>

          <div class="col">
            <strong>Average Rating:</strong> {{ this.avgRating }}
          </div>
        </div>
        <q-list class="full-width" separator>
          <q-item v-for="rating in ratings" :key="rating.id" v-ripple>
            {{ rating.name }}: {{ rating.value }}
          </q-item>
        </q-list>
        <!-- </q-card-section>
      </q-card>-->
      </div>

      <div class="col-4 large-screen-only bg-grey-1" bordered>
        <div class="fixed">
          <div class="text-center bg-grey-4">
            <strong>MY RATINGS</strong>
          </div>

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
import { defineComponent } from "vue";

import {
  collection,
  increment,
  query,
  orderBy,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "boot/firebase";
export default defineComponent({
  setup() {},
  data() {
    return {
      formData: {
        myRating: 0,
      },
      avgRating: 0,

      currentRating: 0,
      ratingExists: false,
      myCurrentRating: 0,
      myRatingExists: false,

      numRatings: 0,
      numMyRatings: 0,
      avgMyRating: 0,
      calc1: 0,
      calc2: 0,
      calc3: 0,
      calc4: 0,
      calc5: 0,
      url_data: null,
      party: {
        name: null,
        description: null,
        time: null,
        date: null,
        inProgress: null,
        host: null,
      },
      partyInfo: [],
      ratings: [],
      myRatings: [],

      name: "Sandi",
      drinkName: "Drink Name",
    };
  },
  methods: {
    submitRating(val) {
      const formMyRating = val;
      getDoc(
        doc(
          db,
          "Parties",
          this.partyID,
          "Drinks",
          this.drinkID,
          "Ratings",
          this.storedID
        )
      ).then((result) => {
        //If I have already rated this drink ////////////////
        if (result.data()) {
          this.calc1 = this.numRatings * this.avgRating;
          this.ratingExists = true;
          this.currentRating = result.data().value;
          //Update the avg rating for the drink based on my previous rating //////////////
          this.calc2 = this.calc1 - this.currentRating + formMyRating;
          this.calc3 = this.calc2 / this.numRatings;
          this.calc4 = this.calc3.toFixed(1);
          updateDoc(doc(db, "Parties", this.partyID, "Drinks", this.drinkID), {
            ratingAvg: Number(this.calc4),
          });
          updateDoc(
            doc(
              db,
              "Parties",
              this.partyID,
              "Drinks",
              this.drinkID,
              "Ratings",
              this.storedID
            ),
            {
              value: formMyRating,
            }
          );
          //Update my personal avg rating for this party based on my previous rating //////
          this.calc1 = this.numMyRatings * this.avgMyRating;

          this.calc2 = this.calc1 - this.currentRating + formMyRating;

          this.calc3 = this.calc2 / this.numMyRatings;

          this.calc4 = this.calc3.toFixed(1);
          updateDoc(doc(db, "users", this.storedID, "Parties", this.partyID), {
            ratingAvg: Number(this.calc4),
          });
          //Update my personal rating for this drink
          updateDoc(
            doc(
              db,
              "users",
              this.storedID,
              "Parties",
              this.partyID,
              "Ratings",
              this.drinkID
            ),
            {
              value: formMyRating,
            }
          );
          this.$q.notify({
            message:
              "Your rating has been added. Use the back button to return to the party.",
          });
        } else {
          this.calc1 = this.numRatings * this.avgRating;
          this.calc2 = this.calc1 + formMyRating;
          this.calc3 = this.numRatings + 1;
          this.calc4 = this.calc2 / this.calc3;
          this.calc5 = this.calc4.toFixed(1);

          //Update the avg rating for the drink based on my new rating //////////////
          updateDoc(doc(db, "Parties", this.partyID, "Drinks", this.drinkID), {
            ratingAvg: Number(this.calc5),
            numRatings: increment(1),
          });
          setDoc(
            doc(
              db,
              "Parties",
              this.partyID,
              "Drinks",
              this.drinkID,
              "Ratings",
              this.storedID
            ),
            {
              name: this.storedName,
              value: formMyRating,
            }
          );

          //Update my personal avg rating for this party based on my new rating //////

          this.calc1 = this.numMyRatings * this.avgMyRating;

          this.calc2 = this.calc1 + formMyRating;
          this.calc3 = this.numMyRatings + 1;
          this.calc4 = this.calc2 / this.calc3;
          this.calc5 = this.calc4.toFixed(1);

          updateDoc(doc(db, "users", this.storedID, "Parties", this.partyID), {
            ratingAvg: Number(this.calc5),
            numRatings: increment(1),
          });

          //Update my personal rating for this drink
          setDoc(
            doc(
              db,
              "users",
              this.storedID,
              "Parties",
              this.partyID,
              "Ratings",
              this.drinkID
            ),
            {
              name: this.drinkName,
              value: formMyRating,
            }
          );
          this.$q.notify({
            message:
              "Your rating has been updated. Use the back button to return to the party.",
          });
        }
      });
    },

    /////////////////////////////////////////////////

    loadRating() {
      const docSnap = onSnapshot(
        doc(
          db,
          "users",
          this.storedID,
          "Parties",
          this.partyID,
          "Ratings",
          this.drinkID
        ),
        (doc) => {
          if (doc.data() == null) {
          } else {
            this.formData.myRating = doc.data().value;
            this.formData.myRatingVal = doc.data().value;
          }
        }
      );
    },
  },

  mounted() {
    this.drinkID = this.$q.sessionStorage.getItem("drinkID");
    this.partyID = this.$q.sessionStorage.getItem("partyID");
    this.storedID = this.$q.localStorage.getItem("storedID");
    this.storedName = this.$q.localStorage.getItem("storedName");
    this.drinkName = this.$q.sessionStorage.getItem("drinkName");
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

    const ratings = query(
      collection(
        db,
        "Parties",
        this.partyID,
        "Drinks",
        this.drinkID,
        "Ratings"
      ),
      orderBy("name", "asc")
    );

    onSnapshot(
      doc(db, "Parties", this.partyID, "Drinks", this.drinkID),
      (docRatingInfo) => {
        this.avgRating = docRatingInfo.data().ratingAvg;
        this.numRatings = docRatingInfo.data().numRatings;
      }
    );

    onSnapshot(
      doc(db, "users", this.storedID, "Parties", this.partyID),
      (result) => {
        this.avgMyRating = result.data().ratingAvg;
        this.numMyRatings = result.data().numRatings;
      }
    );
    this.loadRating();
    // const unsubscribe =
    onSnapshot(ratings, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let ratingChange = change.doc.data();
        ratingChange.id = change.doc.id;
        if (change.type === "added") {
          this.ratings.unshift(ratingChange);
        }
        if (change.type === "modified") {
          let index = this.ratings.findIndex(
            (rating) => rating.id === ratingChange.id
          );
          Object.assign(this.ratings[index], ratingChange);
        }
      });
    });
  },
});
</script>
<style lang="sass">
.my-card
  width: 100%
  max-width: 500px
</style>
