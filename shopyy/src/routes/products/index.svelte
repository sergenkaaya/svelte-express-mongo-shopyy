<script context="module">
  export async function load({ fetch }) {
    const res = await fetch("http://localhost:3000/api/products");
    const json = await res.json();

    if (res.ok) {
      return {
        props: {
          products: json["products"],
          onlyBiddables: json["onlyBiddables"],
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
  export let onlyBiddables = [];
  export let toggle = false;
</script>

<svelte:head>
<title>SHOPY : Tüm Ürünler</title>
</svelte:head>

<div class="toggle"><label>Sadece Teklif Verilebilir Ürünler<input type=checkbox class="toggleBiddables" bind:checked={toggle}></label></div>
{#if !toggle}
<h3>Toplam {products.length} ürün gösteriliyor.</h3>
<div class="itemsContainer">
    <ProductCard products={products}/>
</div>
{:else}
<h3>Toplam {onlyBiddables.length} ürün gösteriliyor.</h3>
<div class="itemsContainer">
    <ProductCard products={onlyBiddables}/>
</div>
{/if}

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");

.toggle {
  height: 32px;
  width: 100%;
  padding-top: 1em;
  padding-left: 40%;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.95em;
   input{
    float: left;
   }
}

input[type="checkbox"] {
  appearance: none;
  background-color: #fff;
  margin: 0;
  font: inherit;
  color: #1B2845;
  width: 1.15em;
  height: 1.15em;
  border: 0.15em solid lightgray;
  border-radius: 0.15em;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;

  &::before {
    content: "";
    width: 0.65em;
    height: 0.65em;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    transform: scale(0);
    transform-origin: bottom left;
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em var(--form-control-color);
    
    background-color: white
  }

  &:checked::before{
    background-color: #1B2845;
    transform: scale(1);
  }
   
}

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
