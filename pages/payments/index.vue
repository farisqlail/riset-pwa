<template>
  <b-card class="mt-4">
    <div class="row-item">
      <div class="item-cart mb-3">
        <div class="d-flex align-self-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/2560px-Logo_ovo_purple.svg.png" width="100" loading="lazy" />
        </div>
        <div class="d-flex align-self-center">
          <nuxt-link to="/invoice" class="btn btn-success">Pilih</nuxt-link>
        </div>
      </div>
      <div class="item-cart mb-3">
        <div class="d-flex align-self-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/2560px-Logo_dana_blue.svg.png" width="100" loading="lazy" />
        </div>
        <div class="d-flex align-self-center">
          <nuxt-link to="/invoice" class="btn btn-success">Pilih</nuxt-link>
        </div>
      </div>
      <div class="item-cart mb-3">
        <div class="d-flex align-self-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/2560px-Logo_dana_blue.svg.png" width="100" loading="lazy" />
        </div>
        <div class="d-flex align-self-center">
          <nuxt-link to="/invoice" class="btn btn-success">Pilih</nuxt-link>
        </div>
      </div>
    </div>
  </b-card>
</template>

<script>
export default {
  methods: {
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