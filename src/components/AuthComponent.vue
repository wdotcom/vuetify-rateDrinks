<template>
  <q-page class="constrain q-pa-md">
    <div>
      <template v-if="tab === 'register'">
        <div class="text-center q-mb-lg">Sign up</div>
      </template>
      <template v-else>
        <div class="text-center q-mb-sm">Sign in</div>
      </template>
      <!--
      <div class="flex flex-center">

        <q-btn
          class="flex flex-center q-px-lg q-py-sm q-mb-md"
          color="primary"
          size="md"
          label="Google"
          @click="google"
        />
      </div> -->

      <q-form @submit="submitForm">
        <q-input
          v-if="tab === 'register'"
          outlined
          class="q-mb-md"
          type="text"
          label="Name"
          v-model="formData.name"
        />
        <q-input
          outlined
          class="q-mb-md"
          type="email"
          label="Email"
          v-model="formData.email"
        />
        <q-input
          outlined
          class="q-mb-md"
          type="password"
          label="Password"
          v-model="formData.password"
        />
        <q-input
          outlined
          v-if="tab === 'register'"
          class="q-mb-md"
          type="password"
          label="Enter Password again"
          v-model="formData.password2"
        />
        <div class="text-center q-my-md">
          <q-btn
            flat
            label="Forgot Password?"
            color="grey-5"
            class="text-capitalize rounded-borders"
            v-if="tab !== 'register'"
            @click="forgotPassword"
          />
        </div>
        <div class="row">
          <q-space />
          <q-btn type="submit" color="primary" :label="tab" />
        </div>
      </q-form>

      <q-dialog v-model="resetPwdDialog">
        <ForgotPassword />
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { auth, db } from "boot/firebase";
import { query, doc, setDoc } from "firebase/firestore";

import {
  updateProfile,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import ForgotPassword from "./ForgotPassword.vue";

let errMsg = "";
export default {
  name: "AuthComponent",
  props: ["tab"],
  components: { ForgotPassword },
  setup() {},
  data() {
    return {
      formData: {
        email: "",
        password: "",
        password2: "",
        name: "",
      },
      //userID: this.uid,
      resetPwdDialog: false,
      clickCount: 2,
    };
  },
  mounted() {
    if (this.$q.localStorage.getItem("storedID") != "") {
      this.$router.push("/showParties");
    } else {
    }
  },
  methods: {
    handleAuthStateChanged() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const userId = user.uid;
          //  $q.localStorage.set("storedID", userId);
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User

          //I don't think I need this section.
          /*
          const dbRef = ref(getDatabase());
          get(child(dbRef, `users/${this.userID}`))
            .then((snapshot) => {
              if (snapshot.exists()) {
                console.log("snapshot:", snapshot.val());
                //const userId = (snapshot.val() && snapshot.val().uid) || "";
                const name =
                  (snapshot.val() && snapshot.val().name) || "Anonymous";
                const email =
                  (snapshot.val() && snapshot.val().email) || "NoEmail";
                const online =
                  (snapshot.val() && snapshot.val().online) || "false";
                console.log("Name", name);
              } else {
                console.log("No data available");
              }
            })
            .catch((error) => {
              console.error(error);
            });
            */
          //////
          /*
          return onValue(
            ref(database, "/users/" + userId),
            (snapshot) => {
              const name =
                (snapshot.val() && snapshot.val().name) || "Anonymous";
              const email =
                (snapshot.val() && snapshot.val().email) || "NoEmail";
              const online =
                (snapshot.val() && snapshot.val().online) || "false";
              // ...
            },
            {
              onlyOnce: true,
            }
          );*/
          //this.$router.push("/users");

          /*Experiment:
          dispatchEvent("firebaseUpdateUser", {
            userId: "fakeUserId",
            updates: {
              online: true,
            },
          }); */
          /*
          const updates = {};
          //updates["/posts/" + newPostKey] = postData;
          updates["/users/" + this.userID + "/online"] = false;

          return update(ref(database), updates);*/

          // ...
        } else {
          // User is signed out
          /*     const updates = {};
          //updates["/posts/" + newPostKey] = postData;
          updates["/users/" + this.userID + "/online"] = false;

          return update(ref(database), updates)
            .then((snapshot) => {
              //  if (snapshot.exists()) {
              console.log("snapshot:", snapshot);
              const name = "";
              const email = "";
              const online = "";
              // } else {
              // console.log("No data available");
              // }
            })
            .catch((error) => {
              console.error(error);
            });*/
        }
      });
    },
    firebaseUpdateUser({}, payload) {
      console.log("payload:", payload);
    },

    checkSigninState() {
      //this works

      const user = auth.currentUser;

      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          console.log(`User signed in ${user.displayName}`);
          const uid = user.uid;
          console.log(uid);

          this.$router.push("/showParties");
          this.$q.notify(`Welcome ${user.displayName}`);
          // ...
        } else {
          console.log("User not signed in");
          // User is signed out
          // ...
        }
      });
    },
    submitForm() {
      if (this.tab === "login") {
        if (!this.formData.email) {
          this.$q.notify({
            message: "You must enter your email address.",
          });
        } else if (!this.formData.password) {
          this.$q.notify({
            message: "You must enter your password.",
          });
        } else {
          this.signInExistingUser(this.formData.email, this.formData.password);
        }
      } else {
        if (!this.formData.name) {
          this.$q.notify({
            message: "You must enter your name.",
          });
        } else if (!this.formData.email) {
          this.$q.notify({
            message: "You must enter your email address.",
          });
        } else if (!this.formData.password) {
          this.$q.notify({
            message: "You must enter your password.",
          });
        } else if (this.formData.password != this.formData.password2) {
          this.$q.notify({ message: "Your passwords do not match" });
        } else {
          this.createUser(
            this.formData.email,
            this.formData.password,
            this.formData.name
          );
        }
      }
    },
    google() {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;

          // The signed-in user info.
          const user = result.user;

          this.$q.notify({
            message: `Welcome back, ${user.displayName}!`,
          });
          this.$router.push("/showParties");
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);

          switch (error.code) {
            case "auth/invalid_email":
              errMsg = "Invalid email format";
              break;
            case "auth/user-not-found":
              errMsg = "No account with that email was found";
              break;
            case "auth/wrong-password":
              errMsg = "That password does not match the email provided.";
              break;
            default:
              errMsg = "Not sure what happened there.";
              this.$q.notify({
                message: "${errorCode} {errorMessage}",
              });
              break;
          }
          this.$q.notify({
            message: "${errMsg}",
          });
          // ...
        });
    },
    signInExistingUser(email, password) {
      //  console.log("Sign in existing:", email, password);
      // auth = getAuth();

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = auth.currentUser;
          //const userU = userCredential.user;

          this.$q.localStorage.set("storedID", user.uid);

          this.$q.localStorage.set("storedName", user.displayName);

          this.$q.notify({
            message: `Welcome back, ${user.displayName}!`,
          });
          this.$router.push("/showParties");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          switch (errorCode) {
            case "auth/invalid-email":
              errMsg = "Invalid email format";
              break;
            case "auth/user-not-found":
              errMsg = "No account with that email was found";

              break;
            case "auth/wrong-password":
              errMsg = "That password does not match the email provided.";
              break;
            default:
              errMsg = "Not sure what happened there.";
              this.$q.notify({
                message: `${errorCode} ${errorMessage}`,
              });
              break;
          }

          this.$q.notify(`${errMsg}`);
        });
    },

    createUser(email, password, name) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in

          const user = userCredential.user;
          this.$q.localStorage.set("storedID", user.uid);
          this.$q.localStorage.set("storedName", name);
          updateProfile(user, {
            displayName: name,
          });
          const userId = user.uid;

          setDoc(doc(db, "users", userId), {
            name: name,
            email: email,
          });

          this.$q.notify({
            message: `Welcome ${name}!`,
          });
          this.$router.push("/showParties");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          this.$q.notify(`${errorCode}`);
          switch (errorCode) {
            case "auth/invalid-email":
              errMsg = "Invalid email format";
              break;
            case "auth/weak-password":
              errMsg = "Your password needs at least 6 characters.";
              break;
            case "auth/email-already-in-use":
              errMsg =
                "That email already exists. We will attempt to log you in.";
              this.signInExistingUser(email, password);
              break;
            default:
              errMsg = "Not sure what happened there.";
              this.$q.notify({
                message: `${errorCode} ${errorMessage}`,
              });
              break;
          }
          this.$q.notify(`${errMsg}`);
          // ..
        });
    },

    forgotPassword() {
      this.resetPwdDialog = true;
    },

    logout() {
      const userId = auth.currentUser.uid;

      this.$q.notify({ message: "success" });

      signOut(auth)
        .then(() => {
          this.$q.notify("Signout successful");
          this.$router.push("/");
          // Sign-out successful.
        })
        .catch((error) => {
          // An error happened.
          console.log(error);
        });
    },
  },
};
</script>
