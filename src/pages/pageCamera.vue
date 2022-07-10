<template>
  <q-page class="constrain-more q-pa-md">
    <div class="camera-frame q-pa-md">
      <video
        v-show="!imageCaptured"
        ref="video"
        class="full-width"
        autoplay
        playsinline
      />
      <canvas
        v-show="imageCaptured"
        ref="canvas"
        class="full-width"
        height="240"
      />
    </div>

    <div class="row q-mt-md">
      <div class="col text-center">
        <q-btn
          v-if="hasCameraSupport && !imageCaptured"
          color="grey-10"
          class="q-mr-md"
          size="lg"
          icon="photo_camera"
          round
          @click="captureImage"
        />
      </div>
      <div class="col text-center">
        <q-btn
          v-if="imageCaptured"
          icon="cancel"
          size="lg"
          color="red"
          @click="cancelCapture"
        />
      </div>
      <div class="col text-center">
        <q-file
          v-if="!imageCaptured"
          clearable
          style="max-width: 200px"
          outlined
          v-model="imageUpload"
          @input="captureImageFallback"
          accept="image/*"
          label="Choose an image"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
      </div>
    </div>

    <div class="row justify-center q-ma-md">
      <q-input
        v-model="post.caption"
        label="Caption"
        dense
        class="col col-sm-6"
      />
    </div>
    <div class="row justify-center q-ma-md">
      <q-btn
        unelevated
        rounded
        color="primary"
        class="q-mt-lg"
        label="Post Image"
        @click="createPost"
      />
    </div>
  </q-page>
</template>

<script>
import { uid } from "quasar";
import { getStorage, ref, uploadBytes } from "firebase/storage";
require("md-gum-polyfill");
export default {
  setup() {},
  data() {
    return {
      post: {
        id: uid(),
        caption: "",
        photo: null,
        date: Date.now(),
      },
      imageCaptured: false,
      imageUpload: [],
      hasCameraSupport: true,
    };
  },
  methods: {
    initCamera() {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((stream) => {
          this.$refs.video.srcObject = stream;
        })
        .catch((error) => {
          this.hasCameraSupport = false;
        });
    },
    captureImage() {
      let video = this.$refs.video;
      let canvas = this.$refs.canvas;
      canvas.width = video.getBoundingClientRect().width;
      canvas.height = video.getBoundingClientRect().height;
      let context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imageCaptured = true;
      this.post.photo = this.dataURItoBlob(canvas.toDataURL());
      this.disableCamera();
    },
    captureImageFallback(file) {
      this.post.photo = file;
      let canvas = this.$refs.canvas;
      let context = canvas.getContext("2d");
      var reader = new FileReader();
      reader.onload = (event) => {
        var img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          this.imageCaptured = true;
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file.path[0].files[0]);
    },
    cancelCapture() {
      this.imageCaptured = false;
      this.imageUpload = null;
      this.post.photo = null;
      this.initCamera();
    },
    disableCamera() {
      this.$refs.video.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      });
    },

    dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(",")[0].indexOf("base64") >= 0)
        byteString = atob(dataURI.split(",")[1]);
      else byteString = unescape(dataURI.split(",")[1]);

      // separate out the mime component
      var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], { type: mimeString });
    },
    createPost() {
      // Get a reference to the storage service, which is used to create references in your storage bucket
      const storage = getStorage();

      // Create a storage reference from our storage service
      const storageRef = ref(storage);
      // Create a reference to 'images/mountains.jpg'
      const flowerImagesRef = ref(storage, "images/flower.jpg");
      uploadBytes(storageRef, file).then((snapshot) => {
        console.log("Uploaded a blob or file!");
      });
      let formData = new FormData();
      formData.append("id", this.post.id);
      formData.append("caption", this.post.caption);
      formData.append("date", this.post.date);
      formData.append("file", this.post.photo, this.post.id + ".png");
    },
  },
  mounted() {
    this.initCamera();
  },
  beforeUnmount() {
    if (this.hasCameraSupport) {
      this.disableCamera();
    }
  },
};
</script>

<style lang="sass">
.camera-frame
  border: 2px solid $grey-10
  border-radius: 10px
</style>
