<template>
  <q-footer elevated>
    <q-toolbar>
      <q-btn
        flat
        round
        color="red-4"
        size="lg"
        icon="cancel"
        to="/showParties"
      />
      <q-space />
      <q-btn
        flat
        round
        color="green-4"
        size="lg"
        @click="saveParty"
        icon="save"
      />
    </q-toolbar>
  </q-footer>
  <q-page>
    <div class="col-8 text-center text-h6">
      <strong>Let's create a new party!</strong>
    </div>

    <q-form @submit="saveParty">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            v-model="formData.partyName"
            placeholder="Name of the party"
            counter
            type="text"
            maxlength="50"
          />
          Date of the party:

          <div class="q-gutter-md row items-start">
            <q-input filled v-model="date" mask="date" :rules="['date']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="date">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <q-input
            v-model="formData.partyTime"
            placeholder="Time of the party"
            counter
            type="text"
            maxlength="15"
          />

          <q-input
            autogrow
            class="new-party"
            type="text"
            bottom-slots
            v-model="formData.partyDescript"
            placeholder="Party Description?"
            counter
            maxlength="280"
          />

          <q-option-group
            v-model="formData.inProgress"
            :options="options"
            inline
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
import {
  collection,
  query,
  orderBy,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "boot/firebase";
import { ref } from "vue";
export default defineComponent({
  name: "PageCreateParty",
  data() {
    return {
      partyID: "",
      formData: {
        partyName: "",
        date: "",
        partyDescript: "",
        inProgress: ref("notStarted"),
        partyTime: "",
      },
      date: ref("2022/07/01"),
      group: ref("notStarted"),

      options: [
        {
          label: "Not started",
          value: "notStarted",
          color: "orange",
        },
        {
          label: "In Progress",
          value: "inProgress",
          color: "positive",
        },
        {
          label: "Completed",
          value: "completed",
          color: "negative",
        },
      ],

      partyDescript: "", //Need this for the text counter to update
      parties: [],
    };
  },
  methods: {
    saveParty() {
      if (!this.formData.partyName) {
        this.$q.notify("Please enter a name for the party.");
      } else {
        let hostName = auth.currentUser.displayName;
        let hostID = auth.currentUser.uid;
        let nameShortCode = this.formData.partyName.replace(/ /g, "-");

        let newParty = {
          hostName: hostName,
          hostID: hostID,
          edit: false,
          name: this.formData.partyName,
          description: this.formData.partyDescript,
          date: this.date,
          inProgress: this.formData.inProgress,
          shortCode: nameShortCode,
          time: this.formData.partyTime,
          approvedIDs: [this.storedID],
          pendingIDs: [],
          pendingPartiers: [],
          approvedPartiers: [hostName],

          ratingAvg: 0,
          numRatings: 0,
        };
        let newPartyData = {
          name: this.formData.partyName,
          ratingAvg: 0,
          numRatings: 0,
        };

        const docRef = addDoc(collection(db, "Parties"), newParty).then(
          (result) => {
            this.partyID = result.id;
            setDoc(
              doc(db, "users", this.storedID, "Parties", result.id),
              newPartyData
            );
            setDoc(doc(db, "Parties", result.id, "approved", this.storedID), {
              name: this.storedName,
            });
          }
        );

        this.parties.unshift(newParty);

        this.formData.partyName = "";
        this.formData.partyDescript = "";
        this.formData.partyTime = "";
        this.formData.inProgress = "notStarted";
        this.$router.push("/showParties");
      }
    },
    notifyBeforeDeleteParty(party) {
      this.$q.notify({
        message: "Are you sure you want to delete? This cannot be undone.",
        color: "negative",
        avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
        actions: [
          {
            label: "YES - Delete it.",
            color: "yellow",
            handler: () => {
              // this.deleteParty(party);
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
    deleteParty(party) {
      deleteDoc(doc(db, "Parties", party.id));
    },
  },
  mounted() {
    this.storedID = this.$q.localStorage.getItem("storedID");
    this.storedName = this.$q.localStorage.getItem("storedName");
    const q = query(collection(db, "Parties"), orderBy("date", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let partyChange = change.doc.data();
        partyChange.id = change.doc.id;
        if (change.type === "added") {
          this.parties.unshift(partyChange);
        }
        if (change.type === "modified") {
          let index = this.parties.findIndex(
            (party) => party.id === partyChange.id
          );
          Object.assign(this.parties[index], partyChange);
        }
        if (change.type === "removed") {
          let index = this.parties.findIndex(
            (party) => party.id === partyChange.id
          );
          this.parties.splice(index, 1);
        }
      });
    });
  },
});
</script>

<style lang="sass">
.new-party
  textarea
    font-size: 14px
    line-height: 1.4 !important

.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4

.party-content
  white-space: pre-line

.party-icons
  margin-left: -5px

.party:not(:first-child)
  border-top: 1px solid rgba(0,0,0,12)
</style>
