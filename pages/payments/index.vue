<template>
  <b-card class="mt-4">
    <div class="row-item">
      <div
        v-for="(item, index) in paymentMethods"
        :key="index"
        class="item-cart mb-3"
      >
        <div class="d-flex align-self-center">
          <img
            :src="getOptimizedImage(item.image)"
            width="100"
            :alt="item.name"
            loading="lazy"
          />
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
  data() {
    return {
      paymentMethods: [
        { name: "OVO", image: require("~/assets/images/ovo.png") },
        { name: "DANA", image: require("~/assets/images/dana.png") },
        { name: "BCA", image: require("~/assets/images/bca.png") },
      ],
    };
  },
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