<template>
  <div class="max-w-screen-2xl mx-auto px-10">
    <!-- <h2 class="text-2xl font-semibold font-mono mb-4">
      {{ attributes.title }}
    </h2> -->
    <div v-html="html" class="markdown"></div>
    <div v-for="(product, index) in attributes.products" :key="index">
      <img class="mx-auto" :src="`../${product.image}`" :alt="product.name" />
    </div>
  </div>
</template>

<script>
export default {
  layout: "guide",
  async asyncData({ params, route }) {
    const guideName = params.slug;
    const markdownContent = await import(`~/contents/guides/${guideName}.md`);
    return {
      attributes: markdownContent.attributes,
      html: markdownContent.html,
      currentUrl: route.path,
    };
  },
  head() {
    return {
      title: `${this.attributes.title} | Vue PWA Organic Fruit Shop`,
    };
  },
};
</script>