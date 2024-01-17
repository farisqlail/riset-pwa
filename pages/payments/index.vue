<template>
  <div>
    <b-card class="mt-4">
      <div class="row-item">
        <div
          v-for="(item, index) in paymentMethods"
          :key="index"
          class="item-cart mb-3"
        >
          <div class="d-flex align-self-center">
            <img
              :src="item.image"
              width="100"
              :alt="item.name"
              format="webp"
              loading="lazy"
            />
          </div>
          <div class="d-flex align-self-center">
            <b-button variant="success" @click="invoice">Pilih</b-button>
          </div>
        </div>
      </div>
    </b-card>
  </div>
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
    invoice() {
      this.$router.push("/invoice");
    },
  },
};
</script>