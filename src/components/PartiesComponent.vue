<template>
  <div v-show="tab === 'allParties'">
    <q-card v-for="party in Parties" :key="party.id" class="my-card q-mb-sm">
      <q-card-section horizontal>
        <div class="col-10 q-pl-xs">
          <div v-if="party.edit === false">
            <div class="text-h5">
              <q-icon name="liquor" />
              {{ party.name }}
            </div>
            <div class="text-overline text-grey-8">
              <q-icon
                class="q-pr-sm"
                color="grey-8"
                name="support_agent"
                size="25px"
              />{{ party.hostName }}
            </div>

            <div class="q-pt-sm q-pb-sm">
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
              <q-icon color="grey-8" name="event" size="20px" />{{ party.date }}
              <q-icon
                class="q-pl-sm"
                name="access_time"
                size="20px"
                color="grey-8"
              />
              {{ party.time }}
            </div>
          </div>
          <div v-else>
            <div class="text-h5">
              <q-input filled v-model="party.name" label="Party Name">
                <template v-slot:before>
                  <q-icon name="liquor" />
                </template>
              </q-input>
            </div>
            <div class="text-overline text-grey-8">
              <q-icon color="grey-8" name="support_agent" class="q-pr-sm" />{{
                party.hostName
              }}
            </div>
            <div>
              <q-input
                filled
                autogrow
                v-model="party.description"
                label="Party Description"
              >
                <template v-slot:before>
                  <q-icon name="description" />
                </template>
              </q-input>
            </div>
            <div class="q-gutter-md q-pt-sm">
              <q-input
                filled
                v-model="party.date"
                mask="date"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" color="green-5" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="party.date">
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

            <div>
              <div class="q-pt-sm">
                <q-input filled v-model="party.time" :rules="['time']">
                  <template v-slot:append>
                    <q-icon
                      name="schedule"
                      color="green-5"
                      class="cursor-pointer"
                    >
                      <q-popup-proxy
                        ref="null"
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time v-model="party.time" mask="h:mm a">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-option-group
                v-model="party.inProgress"
                :options="options"
                inline
              />
            </div>
          </div>
        </div>

        <q-separator vertical />

        <q-card-actions vertical>
          <q-badge
            v-if="$q.localStorage.getItem('storedID') === party.hostID"
            label="Host"
            color="green-9"
          />
          <q-badge
            v-else-if="
              party.approvedIDs.includes(
                this.$q.localStorage.getItem('storedID')
              )
            "
            label="Guest"
            color="green-6"
          />
          <q-badge
            v-else-if="
              party.pendingIDs.includes(
                this.$q.localStorage.getItem('storedID')
              )
            "
            label="Pending"
            color="light-blue"
          />

          <q-btn
            v-else-if="party.inProgress != 'completed'"
            flat
            round
            @click="requestAccess(party)"
            color="light-blue"
            icon="add_circle_outline"
          />
          <q-badge v-else label="CLOSED" color="red" />

          <q-btn
            v-if="
              party.approvedIDs.includes(
                this.$q.localStorage.getItem('storedID')
              )
            "
            flat
            round
            color="green"
            icon="meeting_room"
            @click="enterParty(party)"
          />
          <q-btn
            v-show="
              party.edit === false &&
              this.$q.localStorage.getItem('storedID') === party.hostID
            "
            flat
            round
            color="grey"
            icon="edit"
            @click="editParty(party)"
          />
          <q-btn
            v-show="party.edit === true"
            flat
            icon="save"
            color="grey-9"
            @click="saveParty(party)"
          />
          <q-btn
            v-if="$q.localStorage.getItem('storedID') === party.hostID"
            icon="delete"
            flat
            color="red"
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </div>

  <!--Hosting Parties------------------------------>
  <div v-show="tab === 'hostingParties'">
    <q-card
      v-for="party in filterHostedParties"
      :key="party.id"
      class="my-card q-mb-sm"
    >
      <q-card-section horizontal>
        <div class="col-10 q-pl-xs">
          <div v-if="party.edit === false">
            <div class="text-h5">
              <q-icon name="liquor" />
              {{ party.name }}
            </div>
            <div class="text-overline text-grey-8">
              <q-icon
                class="q-pr-sm"
                color="grey-8"
                name="support_agent"
                size="25px"
              />{{ party.hostName }}
            </div>

            <div class="q-pt-sm q-pb-sm">
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
              <q-icon color="grey-8" name="event" size="20px" />{{ party.date }}
              <q-icon
                class="q-pl-sm"
                name="access_time"
                size="20px"
                color="grey-8"
              />
              {{ party.time }}
            </div>
          </div>
          <div v-else>
            <div class="text-h5">
              <q-input filled v-model="party.name" label="Party Name">
                <template v-slot:before>
                  <q-icon name="liquor" />
                </template>
              </q-input>
            </div>
            <div class="text-overline text-grey-8">
              <q-icon color="grey-8" name="support_agent" class="q-pr-sm" />{{
                party.hostName
              }}
            </div>
            <div>
              <q-input
                filled
                autogrow
                v-model="party.description"
                label="Party Description"
                type="textarea"
              >
                <template v-slot:before>
                  <q-icon name="description" />
                </template>
              </q-input>
            </div>
            <div class="q-gutter-md q-pt-sm">
              <q-input
                filled
                v-model="party.date"
                mask="date"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" color="green-5" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="party.date">
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

            <div>
              <div class="q-pt-sm">
                <q-input filled v-model="party.time" :rules="['time']">
                  <template v-slot:append>
                    <q-icon
                      name="schedule"
                      color="green-5"
                      class="cursor-pointer"
                    >
                      <q-popup-proxy
                        ref="null"
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time v-model="party.time" mask="h:mm a">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-option-group
                v-model="party.inProgress"
                :options="options"
                inline
              />
            </div>
          </div>
        </div>

        <q-separator vertical />

        <q-card-actions vertical>
          <q-badge label="Host" color="green-9" />

          <q-btn
            flat
            round
            color="green"
            icon="meeting_room"
            @click="enterParty(party)"
          />
          <q-btn
            v-show="party.edit === false"
            flat
            round
            color="grey"
            icon="edit"
            @click="editParty(party)"
          />
          <q-btn
            v-show="party.edit === true"
            flat
            icon="save"
            color="grey-9"
            @click="saveParty(party)"
          />
          <q-btn icon="delete" flat color="red" />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </div>

  <!--Attending Parties------------------------------>
  <div v-show="tab === 'attendingParties'">
    <q-card
      v-for="party in attendingParties"
      :key="party.id"
      class="my-card q-mb-sm"
    >
      <q-card-section horizontal>
        <div class="col-10 q-pl-xs">
          <div v-if="party.edit === false">
            <div class="text-h5">
              <q-icon name="liquor" />
              {{ party.name }}
            </div>
            <div class="text-overline text-grey-8">
              <q-icon
                class="q-pr-sm"
                color="grey-8"
                name="support_agent"
                size="25px"
              />{{ party.hostName }}
            </div>

            <div class="q-pt-sm q-pb-sm">
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
              <q-icon color="grey-8" name="event" size="20px" />{{ party.date }}
              <q-icon
                class="q-pl-sm"
                name="access_time"
                size="20px"
                color="grey-8"
              />
              {{ party.time }}
            </div>
          </div>
          <div v-else>
            <div class="text-h5">
              <q-input filled v-model="party.name" label="Party Name">
                <template v-slot:before>
                  <q-icon name="liquor" />
                </template>
              </q-input>
            </div>
            <div class="text-overline text-grey-8">
              <q-icon color="grey-8" name="support_agent" class="q-pr-sm" />{{
                party.hostName
              }}
            </div>
            <div>
              <q-input
                filled
                autogrow
                v-model="party.description"
                label="Party Description"
              >
                <template v-slot:before>
                  <q-icon name="description" />
                </template>
              </q-input>
            </div>
            <div class="q-gutter-md q-pt-sm">
              <q-input
                filled
                v-model="party.date"
                mask="date"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" color="green-5" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="party.date">
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

            <div>
              <div class="q-pt-sm">
                <q-input filled v-model="party.time" :rules="['time']">
                  <template v-slot:append>
                    <q-icon
                      name="schedule"
                      color="green-5"
                      class="cursor-pointer"
                    >
                      <q-popup-proxy
                        ref="null"
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time v-model="party.time" mask="h:mm a">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-option-group
                v-model="party.inProgress"
                :options="options"
                inline
              />
            </div>
          </div>
        </div>

        <q-separator vertical />

        <q-card-actions vertical>
          <q-badge
            v-if="$q.localStorage.getItem('storedID') === party.hostID"
            label="Host"
            color="green-9"
          />
          <q-badge
            v-else-if="
              party.approvedIDs.includes(
                this.$q.localStorage.getItem('storedID')
              )
            "
            label="Guest"
            color="green-6"
          />
          <q-badge
            v-else-if="
              party.pendingIDs.includes(
                this.$q.localStorage.getItem('storedID')
              )
            "
            label="Pending"
            color="light-blue"
          />

          <q-badge v-else label="CLOSED" color="red" />

          <q-btn
            v-if="
              party.approvedIDs.includes(
                this.$q.localStorage.getItem('storedID')
              )
            "
            flat
            round
            color="green"
            icon="meeting_room"
            @click="enterParty(party)"
          />
          <q-btn
            v-show="
              party.edit === false &&
              this.$q.localStorage.getItem('storedID') === party.hostID
            "
            flat
            round
            color="grey"
            icon="edit"
            @click="editParty(party)"
          />
          <q-btn
            v-show="party.edit === true"
            flat
            icon="save"
            color="grey-9"
            @click="saveParty(party)"
          />
          <q-btn
            v-if="$q.localStorage.getItem('storedID') === party.hostID"
            icon="delete"
            flat
            color="red"
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref } from "vue";
import {
  orderBy,
  query,
  collection,
  onSnapshot,
  doc,
  setDoc,
  arrayUnion,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "boot/firebase";

export default {
  name: "PartiesComponent",
  props: ["tab"],
  setup() {},
  data() {
    return {
      Parties: [],
      attendingParties: [],
      storedID: "",

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
  mounted() {
    this.storedID = this.$q.localStorage.getItem("storedID");

    const Parties = query(collection(db, "Parties"), orderBy("date", "asc"));
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
  },
  methods: {
    requestAccess(party) {
      let myId = this.$q.localStorage.getItem("storedID");
      let myName = this.$q.localStorage.getItem("storedName");
      setDoc(doc(db, "users", myId, "Parties", party.id), {
        name: party.name,
        date: party.date,

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
    editParty(party) {
      party.edit = true;
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
      // const storedID = this.$q.localStorage.getItem("storedID");
      return this.filterByValue(this.Parties, this.storedID);
    },
  },
};
</script>
