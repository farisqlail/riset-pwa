<template>
  <div>
    <main>
      <div class="container">
        <div class="row mt-3" v-for="(guide, index) in guides" :key="index">
          <div
            class="col-4"
            v-for="(product, index) in guide.attributes.products"
            :key="index"
          >
            <b-card
              :title="product.name"
              :img-src="product.image"
              :img-alt="product.name"
              img-top
              tag="article"
              style="max-width: 20rem"
              class="mb-2"
            >
              <b-card-text> ${{ product.price }} </b-card-text>

              <b-button
                variant="primary"
                :data-item-id="product.sku"
                :data-item-name="product.name"
                :data-item-price="product.price"
                :data-item-image="product.image"
                >Tambah Keranjang</b-button
              >
            </b-card>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import guides from "~/contents/guides/guides.js";

export default {
  async asyncData({ route }) {
    const promises = guides.map((guide) =>
      import(`~/contents/guides/${guide}.md`)
    );
    return { guides: await Promise.all(promises) };
  },
  head() {
    return {
      title: "Mie Gacoan PWA",
    };
  },
};
</script>
