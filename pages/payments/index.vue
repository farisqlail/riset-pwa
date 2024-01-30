<template>
  <b-card class="mt-4">
    <div class="row-item">
      <div class="item-cart mb-3">
        <div class="d-flex align-self-center">
          <img src="../../assets/images/ovo.png" width="100" loading="lazy" />
        </div>
        <div class="d-flex align-self-center">
          <b-button @click="toInvoice" class="btn btn-success">Pilih</b-button>
        </div>
      </div>
      <div class="item-cart mb-3">
        <div class="d-flex align-self-center">
          <img src="../../assets/images/dana.png" width="100" loading="lazy" />
        </div>
        <div class="d-flex align-self-center">
          <b-button @click="toInvoice" class="btn btn-success">Pilih</b-button>
        </div>
      </div>
      <div class="item-cart mb-3">
        <div class="d-flex align-self-center">
          <img src="../../assets/images/bca.png" width="100" loading="lazy" />
        </div>
        <div class="d-flex align-self-center">
          <b-button @click="toInvoice" class="btn btn-success">Pilih</b-button>
        </div>
      </div>
    </div>
  </b-card>
</template>

<script>
export default {
  methods: {
    toInvoice(){ 
      this.$router.push("/invoice");
    },

    getOptimizedImage(imagePath) {
      const supportsWebP = this.browserSupportsWebP();
      let optimizedPath = imagePath;

      if (supportsWebP) {
        optimizedPath += "?format=webp";
      }

      return optimizedPath;
    },

    browserSupportsWebP() {
      // Check if running in a browser environment
      if (process.client) {
        const elem = document.createElement("canvas");

        if (!!(elem.getContext && elem.getContext("2d"))) {
          return elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
        }
      }

      return false;
    },
  },
};
</script>