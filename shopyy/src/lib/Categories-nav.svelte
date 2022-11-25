<script>
  export let categories = [];
</script>

<div class="container">
  <nav class="categories-nav">
    <a href="/products">All products</a>
    {#each categories as category}
      <a href={`/products/${category.slug}`}>{category.title}</a>
    {/each}
    <nav />
  </nav>
</div>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");
  
  .container {
    display: block;
    font-family: "Montserrat", sans-serif;
    padding: 1em;
    background: #033860;
    text-align: center;

    .categories-nav {

      a {
        color: #ffffff;
        font-size: 1.2em;
        font-weight: 500;
        text-transform: uppercase;
        text-decoration: none;
        display: inline-block;
        padding: 10px;
        border:1px solid transparent;

        &:hover {
          border: solid 1px #ffffff;
        }

        &:active {
          border: solid 1px #ffffff;
        }
      }
    }
  }
</style>
