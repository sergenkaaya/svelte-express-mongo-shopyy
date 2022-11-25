<script>
  export let products = [];

  function currency(price) {
    let priceint = Number(price);
    return priceint.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }
</script>

{#each products as product}
<a href={`/products/${product.category.slug}/${product._id}`}>
  <div class="card">
    <div class="imgBox">
      <img src={product.imagePath} alt="" />
    </div>
    <div class="contentBox">
      <div class="title">
        <h3>{product.title}</h3>
      </div>
      <div class="priceBox">
        <h6>HEMEN SATIN AL FİYATI :</h6>
        <h2 class="price">{currency(product.BuyOutprice)}</h2>
        {#if product.Bid.price != null}
          <h6>EN GÜNCEL TEKLİF :</h6>
          <h2>{currency(product.Bid.price)}</h2>
        {/if}
      </div>
    </div>
  </div>
</a>  
{/each}

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap");

  a {
    color:#32373B;
    text-decoration: none;
    padding: 0;
  }

  .card {
    display: inline-block;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
    position: relative;
    width: 200px;
    height: 384px;
    margin: 1em;
    background-color: #f9f7f3;
    overflow: hidden;
    text-transform: uppercase;
    text-align: center;
    font-family: "Montserrat", sans-serif;

    .imgBox {
      padding-top: 1.25em;
      width: 100%;
      

      img {
        width: 5em;
      }
    }

    .contentBox {
      width: 100%;

      h6 {
        margin: 0 0 -20px 0;
        padding: 0 0 0 0;
      }

      .title {
        padding: 0 12px;
      }

      .priceBox {
        margin-bottom: -20px;
        height: 64px;
        width: 100%;
        text-align: center;
      }
    }
  }


  /*-webkit-text-size-adjust: 100%;
    font-size: 14px;
    line-height: 20px;
    font-family: "Amazon Ember",Arial,sans-serif;
    color: #0F1111;
    box-sizing: border-box;
    max-width: 297px;
    min-width: 198px;
    float: left;
    text-align: left;
    position: relative;
    padding: 0 2px 0 0 !important;
    margin: 0 !important;
    height: 100%;
    word-wrap: break-word;
    list-style: none;
    display: inline-block;
    width: 198px;*/
</style>
