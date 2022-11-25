<script context="module">
  export async function load({ fetch }) {
    const res = await fetch("http://localhost:3000/api/products/featured");
    const json = await res.json();

    if (res.ok ) {
      return {
        props: {
          products: json["featuredProds"],
          onlybiddables: json["onlyBiddables"],
          featuredCateg: json["featuredCateg"],
          featuredCategProds: json["featuredCategProds"]
        },
      };
    }

    return {
      status: res.status,
      error: new Error("Başaramadık"),
    };
  }
</script>

<svelte:head>
<title>SHOPY : Anasayfa</title>
</svelte:head>

<script>
import ProductCard from "$lib/ProductCard.svelte";
import Icon from "@iconify/svelte";
export let products = [];
export let onlybiddables = []
export let featuredCateg;
export let featuredCategProds = [];

</script>

<div class="wrapper">
  <div class="container">
    <div class="featured">
      <div class="tt">
        <h2>Öne Çıkan Ürünler</h2>
      </div>
      <div class="prods">
         <ProductCard {products}/>
      </div>
    </div>
    <div class="featured">
      <div class="tt">
        <a href={`/products/only-biddable`}><h2>Sadece Teklif Verilebilen Ürünleri İnceleyin <span><Icon icon="akar-icons:chevron-right" inline={true} /></span></h2></a>
      </div>
      <div class="prods">
         <ProductCard products={onlybiddables}/>
      </div>
      <div class="featured">
        <div class="tt">
          <a href={`/products/${featuredCateg[0].slug}`}><h2> {featuredCateg[0].title} Kategorisini İnceleyin <span><Icon  icon="akar-icons:chevron-right" inline={true} /></span></h2></a>
        </div>
        <div class="prods">
           <ProductCard products={featuredCategProds}/>
        </div>
    </div>
  </div>
 </div> 
</div>


  
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");
  .wrapper {
    height: 100%;
    width: 100%;
    font-family: 'Montserrat', sans-serif;
    color: #292F36;

    a {
      text-decoration: none;
      color: #292F36;

      
    }

    .container {
      margin: 0 auto;
      width: 80%;
      height: 100%;

      .featured {
        padding-top: 2em;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .prods {
          display: flex;
          flex-direction: row;
        }

        h2 {
          margin: 0;
          border-bottom: 1px solid transparent;
          
          &:hover {
            border-bottom: 1px solid #292F36;
          }
        }
      }

    }
  }
    /*@media (min-width: 640px) {
      main {
        max-width: none;
      }
    }*/
</style>
  