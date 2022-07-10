<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!--All Parties----------------------------------------->
      <template v-if="tab === 'allParties'">
        <q-list class="full-width" separator>
          <q-item v-for="party in Parties" :key="party.id" v-ripple>
            <div>
              <div class="text-h5">
                <q-icon name="liquor" />
                {{ party.name }}
              </div>
              <div class="text-overline text-grey-8">
                <q-icon
                  class="q-pr-sm"
                  color="black"
                  name="support_agent"
                  size="30px"
                />{{ party.hostName }}
                <q-badge
                  v-if="$q.localStorage.getItem('storedID') === party.hostID"
                  label="HOST"
                  color="light-blue"
                />
                <q-badge
                  v-else-if="
                    party.approvedIDs.includes(
                      this.$q.localStorage.getItem('storedID')
                    )
                  "
                  label="GUEST"
                  color="light-blue"
                />
                <q-badge
                  v-else-if="
                    party.pendingIDs.includes(
                      this.$q.localStorage.getItem('storedID')
                    )
                  "
                  label="PENDING"
                  color="light-blue"
                />
                <q-btn
                  v-else-if="party.inProgress != 'completed'"
                  flat
                  color="light-blue"
                  icon="add_circle_outline"
                  @click="requestAccess(party)"
                />
              </div>
              <div class="q-pt-xs q-pb-sm">
                <q-badge
                  v-if="party.inProgress === 'inProgress'"
                  label="Party in progress"
                  color="light-green"
                />
                <q-badge
                  v-else-if="party.inProgress === 'notStarted'"
                  label="Party has not started"
                  color="orange"
                />
                <q-badge v-else label="Party has completed" color="red" />
              </div>
              <div class="text-grey-8">
                <q-icon color="black" name="event" size="30px" />{{
                  party.date
                }}
                <q-icon
                  class="q-pl-sm"
                  name="access_time"
                  size="30px"
                  color="black"
                />
                {{ party.time }}
              </div>

              <div
                class="center"
                v-show="
                  party.approvedIDs.includes(
                    this.$q.localStorage.getItem('storedID')
                  )
                "
              >
                <div class="col-4" align="center">
                  <q-btn
                    icon="meeting_room"
                    color="green"
                    flat
                    size="xl"
                    @click="enterParty(party)"
                  />
                </div>
              </div>
            </div>
          </q-item>
        </q-list>
      </template>

      <!--PARTIES I AM HOSTING----------------------------->
      <template v-if="tab === 'hostingParties'">
        <q-list separator>
          <q-item v-for="party in filterHostedParties" :key="party.id" v-ripple>
            <div v-show="$q.localStorage.getItem('storedID') === party.hostID">
              <div v-if="party.edit === false" class="q-mt-sm q-mb-xs">
                <div class="text-h5">
                  <q-icon class="q-pr-sm" name="liquor" size="30px" />
                  <strong> {{ party.name }}</strong>
                </div>
                <div class="text-overline text-grey-8">
                  <q-icon
                    color="black"
                    name="support_agent"
                    size="30px"
                    class="q-pr-sm"
                  />{{ party.hostName }}
                </div>
                <q-badge
                  v-if="party.inProgress === 'inProgress'"
                  label="Party in progress"
                  color="light-green"
                />
                <q-badge
                  v-else-if="party.inProgress === 'notStarted'"
                  label="Party has not started"
                  color="orange"
                />
                <q-badge v-else label="Party has completed" color="red" />
                <div class="q-pt-sm q-pb-sm q-pr-sm">
                  <q-icon size="30px" name="description" />
                  <strong>Description</strong>

                  <div class="text-body q-pl-xl q-pb-sm">
                    {{ party.description }}
                  </div>

                  <q-icon size="30px" name="event" />
                  {{ party.date }}
                  <q-icon size="30px" name="access_time" />
                  {{ party.time }}
                </div>
              </div>
              <div v-if="party.edit === true" class="q-mt-sm q-mb-xs">
                <div class="text-h5">
                  <q-input filled v-model="party.name" label="Party Name">
                    <template v-slot:before>
                      <q-icon name="liquor" />
                    </template>
                  </q-input>
                </div>
                <div class="text-overline text-grey-8">
                  <q-icon
                    color="black"
                    name="support_agent"
                    size="30px"
                    class="q-pr-sm"
                  />{{ party.hostName }}
                </div>
                <div>
                  <q-input
                    filled
                    v-model="party.description"
                    label="Party Description"
                  >
                    <template v-slot:before>
                      <q-icon name="description" />
                    </template>
                  </q-input>
                </div>
                <div class="q-pt-sm">
                  <q-input
                    filled
                    v-model="party.date"
                    label="Party Date"
                    mask="####/##/##"
                    hint="yyyy/mm/dd"
                  >
                    <template v-slot:before>
                      <q-icon name="event" />
                    </template>
                  </q-input>
                </div>
                <div class="q-pt-sm">
                  <q-input filled v-model="party.time" label="Party Time">
                    <template v-slot:before>
                      <q-icon name="access_time" />
                    </template>
                  </q-input>
                  <q-option-group
                    v-model="party.inProgress"
                    :options="options"
                    inline
                  />
                </div>
              </div>

              <div class="row q-pt-md">
                <div class="col q-pb-md">
                  <strong>Partiers:</strong>
                  <div
                    v-for="partiers in party.approvedPartiers"
                    :key="partiers"
                  >
                    {{ partiers }},
                  </div>
                </div>

                <div class="col">
                  <strong>Partiers waiting for approval:</strong>
                  <div
                    v-for="pendingPartiers in party.pendingPartiers"
                    :key="pendingPartiers"
                  >
                    {{ pendingPartiers }},
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-4">
                  <q-btn
                    v-show="party.edit === false"
                    flat
                    color="grey-9"
                    icon="edit"
                    size="xl"
                    @click="editParty(party)"
                  />
                  <q-btn
                    v-show="party.edit === true"
                    flat
                    size="xl"
                    icon="save"
                    color="grey-9"
                    @click="saveParty(party)"
                  />
                </div>

                <div class="col-4">
                  <q-btn
                    icon="meeting_room"
                    color="green"
                    flat
                    size="xl"
                    @click="enterParty(party)"
                  />
                </div>
                <div class="col-4">
                  <q-btn
                    class="q-pl-lg"
                    flat
                    rounded
                    color="red"
                    size="xl"
                    icon="delete"
                    @click="notifyBeforeDeleteParty(party)"
                  />
                </div>
              </div>
            </div>
          </q-item>
        </q-list>
      </template>

      <!--PARTIES I AM ATTENDING----------------------------->
      <template v-if="tab === 'attendingParties'">
        <q-list class="full-width" separator>
          <q-item v-for="party in attendingParties" :key="party.id" v-ripple>
            <div>
              <div class="text-h5">
                <q-icon class="q-pr-sm" name="liquor" size="30px" />
                <strong> {{ party.name }}</strong>
              </div>
              <div class="text-overline text-grey-8">
                <q-icon
                  color="black"
                  name="support_agent"
                  size="30px"
                  class="q-pr-sm"
                />{{ party.hostName }}
              </div>
              <q-badge
                v-if="party.inProgress === 'inProgress'"
                label="Party in progress"
                color="light-green"
              />
              <q-badge
                v-else-if="party.inProgress === 'notStarted'"
                label="Party has not started"
                color="orange"
              />
              <q-badge v-else label="Party has completed" color="red" />

              <div class="q-pt-sm">
                <q-icon class="q-pr-sm" size="30px" name="description" />
                <strong>Description</strong>
              </div>
              <div class="text-body q-pl-xl q-pb-sm">
                {{ party.description }}
              </div>

              <q-icon size="30px" name="event" />
              {{ party.date }}
              <q-icon size="30px" name="access_time" />
              {{ party.time }}

              <div class="q-pb-md q-pt-md">
                <strong>Partiers:</strong>
                <div v-for="partiers in party.approvedPartiers" :key="partiers">
                  {{ partiers }},
                </div>
              </div>

              <div align="center">
                <q-btn
                  icon="meeting_room"
                  color="green"
                  flat
                  size="xl"
                  @click="enterParty(party)"
                />
              </div>
            </div>

            <div
              v-if="
                party.pendingIDs.includes(
                  this.$q.localStorage.getItem('storedID')
                )
              "
            >
              <div class="text-h5">
                <q-icon class="q-pr-sm" name="liquor" size="30px" />
                <strong> {{ party.name }}</strong>
              </div>
              <div class="text-overline text-grey-8">
                <q-icon
                  color="black"
                  name="support_agent"
                  size="30px"
                  class="q-pr-sm"
                />{{ party.hostName }}
              </div>
              <q-badge label="Pending Approval" color="blue" />
              <div class="q-pt-sm">
                <q-icon class="q-p4-sm" size="30px" name="description" />
                <strong>Description</strong>
              </div>
              <div class="text-body q-pl-xl q-pb-md">
                {{ party.description }}
              </div>

              <q-icon size="30px" name="event" />
              {{ party.date }}
              <q-icon size="30px" name="access_time" />
              {{ party.time }}
            </div>
            <div v-else></div>
          </q-item>
        </q-list>
      </template>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";

import {
  collection,
  query,
  orderBy,
  where,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";

import { auth, db } from "boot/firebase";

export default {
  name: "PartiesComponent2",
  props: ["tab"],

  setup() {},
  data() {
    return {
      Parties: [],
      attendingParties: [],
      approvePeople: false,

      // hostedParties: [],
      storedID: "",

      date: ref("2022/05/01"),
      group: ref("notStarted"),
      name: "Sandi",
      user: {
        name: "Clayton",
        id: "qFC5Wj74rn1RF3ZqiCLL",
      },

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
    editParty(party) {
      party.edit = true;
    },
    enterParty(party) {
      this.$q.sessionStorage.set("partyID", party.id);
      this.$q.sessionStorage.set("partyName", party.name);

      this.$q.sessionStorage.set("partyHost", party.hostName);
      this.$q.sessionStorage.set("partyHostID", party.hostID);
      this.$q.sessionStorage.set("partyDescription", party.description);
      this.$q.sessionStorage.set("partyDate", party.date);
      this.$q.sessionStorage.set("partyTime", party.time);
      this.$q.sessionStorage.set("partyInProgress", party.inProgress);

      this.$router.push("/showParty");
    },
    approvePartiersPages(party) {
      this.$q.sessionStorage.set("partyID", party.id);
      this.$q.sessionStorage.set("partyName", party.name);
      this.$q.sessionStorage.set("partyHostName", party.hostName);
      this.$q.sessionStorage.set("partyDescription", party.description);
      this.$q.sessionStorage.set("partyDate", party.date);
      this.$q.sessionStorage.set("partyTime", party.time);
      this.$q.sessionStorage.set("partyInProgress", party.inProgress);
      //  let urlLink = "/showParty/" + party.id;
      //this.$router.push(urlLink);
      this.$router.push("/showParty");
    },
    approvePartiers(party) {
      this.approvePeople = true;
      const partiersPending = query(
        collection(db, "Parties", party.id, "pending")
      );

      const unsubscribe = onSnapshot(partiersPending, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let partyChange = change.doc.data();
        });
      });
    },
    showParties(party) {
      const partiersPending = query(
        collection(db, "Parties", party, "pending")
      );
      const unsubscribe = onSnapshot(partiersPending, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let partyChange = change.doc.data();
          partyChange.id = change.doc.id;

          this.partiersPend.push(partyChange.name);
        });
      });
    },
    requestAccess(party) {
      let myId = this.$q.localStorage.getItem("storedID");
      let myName = this.$q.localStorage.getItem("storedName");
      setDoc(doc(db, "users", myId, "Parties", party.id), {
        name: party.name,
        date: party.date,
        approved: "pending",
        hostID: party.hostID,
        numRatings: 0,
        ratingAvg: 0,
      });
      setDoc(doc(db, "Parties", party.id, "pending", myId), {
        name: myName,
      });

      updateDoc(doc(db, "Parties", party.id), {
        pendingIDs: arrayUnion(myId),
        pendingPartiers: arrayUnion(myName),
      });
      this.$q.notify({
        message: "Your request to attend this party has been sent to the host.",
      });
    },
    notifyBeforeDeleteParty(party) {
      this.$q.notify({
        message: "Are you sure you want to delete? This cannot be undone.",
        avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
        actions: [
          {
            color: "white",
            icon: "delete",
            label: "YES - Delete it.",
            handler: () => {
              this.deleteParty(party);
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
    deleteParty(party) {
      deleteDoc(doc(db, "Parties", party.id));
    },
    saveParty(party) {
      party.edit = false;

      updateDoc(doc(db, "Parties", party.id), {
        description: party.description,
        name: party.name,
        inProgress: party.inProgress,
        date: party.date,
        time: party.time,
      });
      updateDoc(doc(db, "users", this.storedID, "Parties", party.id), {
        name: party.name,
      });
    },
    filterByValue(array, string) {
      return array.filter((o) =>
        Object.keys(o).some((k) => o[k].includes(string))
      );
    },
  },
  computed: {
    filterHostedParties: function () {
      const storedID = this.$q.localStorage.getItem("storedID");
      return this.Parties.filter(function (u) {
        return storedID === u.hostID;
      });
    },
    filterAttendedParties: function () {
      const storedID = this.$q.localStorage.getItem("storedID");
      return this.filterByValue(this.Parties, this.storedID);
      //   return this.Parties.filter(function (u) {
      //    return storedID === u.approvedIDs;
      // });
    },
  },
  mounted() {
    this.storedID = this.$q.localStorage.getItem("storedID");

    const pendingPartiers = query(
      collection(db, "Parties"),
      where("hostID", "==", this.storedID),
      where("pendingPartiers", "!=", "")
    );

    onSnapshot(pendingPartiers, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let pendingPartiersChange = change.doc.data();
        pendingPartiersChange.id = change.doc.id;
        if (change.type === "added") {
          if (pendingPartiersChange.pendingPartiers != "") {
            this.$q.notify({
              message: `You have partiers requesting access to ${pendingPartiersChange.name}. Please enter the party, click on the down arrow beside 'Partiers' so you can approve or deny them.`,
              actions: [
                {
                  label: "Dismiss",
                  color: "white",
                  handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          }
        }
      });
    });

    const Parties = query(collection(db, "Parties"), orderBy("date", "asc"));
    const attendingParties = query(
      collection(db, "Parties"),
      where("approvedIDs", "array-contains", this.storedID)
    );

    onSnapshot(attendingParties, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let attendingChange = change.doc.data();
        attendingChange.id = change.doc.id;
        if (change.type === "added") {
          this.attendingParties.unshift(attendingChange);
        }
        if (change.type === "modified") {
          let index = this.attendingParties.findIndex(
            (aParty) => aParty.id === attendingChange.id
          );
          Object.assign(this.attendingParties[index], attendingChange);
        }
      });
    });

    onSnapshot(Parties, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let partyChange = change.doc.data();
        partyChange.id = change.doc.id;
        if (change.type === "added") {
          this.Parties.unshift(partyChange);
        }
        if (change.type === "modified") {
          let index = this.Parties.findIndex(
            (party) => party.id === partyChange.id
          );
          Object.assign(this.Parties[index], partyChange);
        }
        if (change.type === "removed") {
          let index = this.Parties.findIndex(
            (party) => party.id === partyChange.id
          );
          this.Parties.splice(index, 1);
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
