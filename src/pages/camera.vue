<template>
  <q-page class="constrain-more q-pa-md">
    <div class="camera-frame q-pa-md">
      <video
      v-show = "!imageCaptured"
      ref="video"
      class="full-width"
      autoplay
      />
      <canvas
      v-show = "imageCaptured"
      ref='canvas'
      class="full-width"
      height="240"
      />
    </div>
    <div class="text-center q-pa-md">
      <q-btn
      v-if = 'hasCameraSupport'
      @click='captureImage'
      round
      color="grey-10"
      icon="eva-camera"
      size="lg"
      />
      <q-file
      v-if="!hasCameraSupport"
      outlined
      v-model="imageUpload"
      @input="captureImageFallback"
      label="Upload an image"
      accept="image/*"
      >
        <template v-slot:prepend>
          <q-icon name="eva-attach-outline" />
        </template>
      </q-file>
      <div class="row justify-center q-ma-md">
        <q-input
        v-model="post.caption"
        class='col col-sm-6'
        label="caption"
        dense
        />
        </div>
        <div class="row justify-center q-ma-md">
          <q-input
          v-model="post.location"
          class='col col-sm-6'
          label="location"
          dense
          >
            <template v-slot:append>
              <q-btn round dense flat icon="eva-navigation-2-outline" />
            </template>
          </q-input>
      </div>
      <div class="row justify-center q-mt-lg">
        <q-btn unelevated rounded color="primary" label="Submit post" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { uid } from 'quasar';

require('md-gum-polyfill');

export default {
  name: 'camera',
  data() {
    return {
      post: {
        id: uid(),
        caption: '',
        location: '',
        photo: null,
        date: Date.now(),
      },
      imageCaptured: false,
      hasCameraSupport: true,
      imageUpload: [],
    };
  },
  methods: {
    initCamera() {
      navigator.mediaDevices.getUserMedia({
        video: true,
      }).then((stream) => {
        this.$refs.video.srcObject = stream;
      }).catch(() => {
        this.hasCameraSupport = false;
      });
    },
    captureImage() {
      const { video } = this.$refs;
      const { canvas } = this.$refs;
      canvas.width = video.getBoundingClientRect().width;
      canvas.height = video.getBoundingClientRect().height;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imageCaptured = true;
      this.post.photo = this.dataURItoBlob(canvas.toDataURL());
      this.disableCamera();
    },
    captureImageFallback(file) {
      this.post.photo = file;
      const { canvas } = this.$refs;
      const context = canvas.getContext('2d');
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          this.imageCaptured = true;
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    disableCamera() {
      this.$refs.video.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      });
    },
    dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      const byteString = atob(dataURI.split(',')[1]);

      // separate out the mime component
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to an ArrayBuffer
      const ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      const ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      const blob = new Blob([ab], { type: mimeString });
      return blob;
    },
  },
  mounted() {
    this.initCamera();
  },
  beforeDestroy() {
    if (this.hasCameraSupport) {
      this.disableCamera();
    }
  },
};
</script>

<style lang="scss">
  .camera-frame
    {
      border: 2px solid $grey-10;
      border-radius: 10px
    }
</style>
