<template>
  <div class="flex flex-center">
    <q-card style="width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Reset Password</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pt-md">
        <q-form ref="resetPasswordForm">
          <q-input
            type="email"
            v-model="form.email"
            label="Email *"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type your email',
            ]"
          />
        </q-form>
        <q-card-actions align="right">
          <div class="row q-mt-xs">
            <q-btn
              class="q-pl-md q-pr-md q-mr-md text-capitalize rounded-borders"
              label="Submit"
              color="primary"
              @click="resetPassword"
              v-close-popup
            />
          </div>
        </q-card-actions>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
export default {
  name: "ForgotPassword",
  data() {
    return {
      form: {
        email: "",
      },
    };
  },
  methods: {
    resetPassword() {
      // firebase reset password
      const auth = getAuth();
      sendPasswordResetEmail(auth, this.form.email)
        .then(() => {
          // Password reset email sent!
          this.$q.notify("Please check your email!");
          // ..
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode == "auth/user-not-found") {
            this.$q.notify("This email has not been registered.");
            this.$router.push("/");
          } else if (errorCode == "auth/missing-email") {
          } else {
            this.$q.notify("error: ", errorCode);
          }
          console.log(errorCode, " and ", errorMessage);
          // ..
        });
    },
  },
};
</script>
