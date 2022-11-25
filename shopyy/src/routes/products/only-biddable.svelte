<script context="module">
    export async function load({ fetch }) {
      const res = await fetch("http://localhost:3000/api/products/only-biddable");
      const json = await res.json();
  
      if (res.ok) {
        return {
          props: {
            products: json["products"],
          },
        };
      }
  
      return {
        status: res.status,
        error: new Error("Başaramadık"),
      };
    }
  </script>
  
  <script>
    import ProductCard from "$lib/ProductCard.svelte";
    export let products = [];
  
    function currency(price) {
      let priceint = Number(price);
      return priceint.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    }
  </script>

<svelte:head>
  <title>SHOPY : Sadece Teklif Verilebilir Ürünler</title>
  </svelte:head>

  <h3>Sadece teklif verilebilir toplam {products.length} ürün gösteriliyor.</h3>
  <div class="itemsContainer">
    <ProductCard {products} />
  </div>
  
  <style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");
    h3{
      margin: 0 auto;
      padding-top: 1em;
      padding-left: 2em;
      font-family: 'Montserrat',sans-serif;
    }
  
    .itemsContainer {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
    }
  </style>
  