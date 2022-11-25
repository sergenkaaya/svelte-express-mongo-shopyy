<script context="module">
  export async function load({ params, fetch }) {
    const slug = params.slug;
    const id = params.id;
    console.log(slug);
    const res = await fetch(`http://localhost:3000/api/products/${slug}/${id}`);
    const json = await res.json();

    if (res.ok) {
      return {
        props: {
          product: json["product"],
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
import { goto } from "$app/navigation";

  import { session } from "$app/stores";
  import { notifications } from "$lib/notifications";
  import Toast from "$lib/Toast.svelte";
  import Icon from "@iconify/svelte";
  export let user = $session.user
  export let product;
  export let result = "";
  export let BidPrice = 0;

  async function addtoCart() {
    const res = await fetch(
      `http://localhost:3000/api/cart/addtocart/${product._id}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if(res.status == 200) {
      notifications.success(`${product.title} başarıyla sepete eklendi.`,850)
    }

    else {
      notifications.danger("Hata Oluştu. Lütfen Tekrar Deneyin.",850)
    }
  }

  async function BuyNow() {
    const res = await fetch(
      `http://localhost:3000/api/cart/addtocart/${product._id}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if(res.status == 200 && user) {
      goto("/checkout");
    }

    else {
      notifications.danger("Giriş Yapmalısın.",850)
    }
  }

  async function makeBid() {
    const res = await fetch(
      `http://localhost:3000/api/bid/make-bid/${product._id}`,
      {
        method: "POST",
        body: JSON.stringify({
          BidPrice,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const json = await res.json();
    result = JSON.stringify(json);

    if(res.status == 200) {
      notifications.success(`${BidPrice} değerinde Teklif Başarılı`,850)
    }
    else {
      notifications.danger(`${result}`,850)
      setTimeout(() => {
        location.reload();
      }, 2000);
    }
  }

  function currency(price) {
    let priceint = Number(price);
    return priceint.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  

</script>
<svelte:head>
<title>SHOPY : {product.title}</title>
</svelte:head>

<span class="map"> <a href={`/products`}>Products</a> <Icon icon="akar-icons:chevron-right" color="#1B2845" inline={true}/> <a href={`/products/${product.category.slug}`}>{product.category.title}</a><Icon icon="akar-icons:chevron-right" color="#1B2845" inline={true}/> {product.title}</span>
<div class="itemContainer">
  <Toast/>
  <div class="itemCard">
    <div class="imgCard">
      <a target="_blank" href={product.imagePath}
        ><img
          alt={product.description}
          class="productImg"
          src={product.imagePath}
        /></a
      >
    </div>
    <div class="productDetail">
      <span class="productCode">{product.productCode}</span>
      <hr />
      <span class="productName">{product.title}</span>
      <hr />
      <span class="price">{currency(product.BuyOutprice)}</span>
      <hr/>
      <span class="description">{product.description}</span>
      <hr />
      {#if !product.Bid.price}
         <p>*Bu ürüne Teklif yapılamaz</p>
      {:else}
      <span class="bid">Güncel Teklif : {currency(product.Bid.price)}</span>
      <input disabled={!user} type="number" class="bid-input" bind:value={BidPrice} /><button
        disabled={!user}
        class="make-bid"
        on:click={makeBid}>Teklif Ver</button
      >
      {#if !user}
      <p> **Teklif vermek için giriş yapmalısın.</p>
      {/if} 
      {/if}  
    </div>
  </div>
  <div class="productBuy">
    <span class="price">{currency(product.BuyOutprice)}</span>
    <div class="stock">
      <span class="available">Stokta Var</span>
    </div>
    <div class="buttonsContainer">
      <button class="addToCart" on:click={addtoCart}>Sepete Ekle</button>
      <button class="addToCart" style="background-color: #78BCE2;" on:click={BuyNow}>Hemen Satın Al</button>
    </div>
  </div>
</div>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap");

  hr {
    border: none;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
  }

  .map {
    position: absolute;
    font-family: "Montserrat", sans-serif;
    padding: 1em 3em;

    a {
      text-decoration: none;
      color: #031D44;

      &:hover {
        text-decoration: underline;
      }
    }
  }
  .itemContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 5em 0 5em 0;
    width: 100%;
    font-family: "Montserrat", sans-serif;
    
    span {
        display: inline-block;
        margin: 0.5em 0 0.5em 0;
      }
    
      .itemCard {
      display: flex;
      width: 60%;
      border-radius: 8px;
      padding: 1.5em;

      .imgCard {
        flex: 1 1 4em;
        
        img {
          width: 5.5em;
          float: left;
          &:hover {
            width: 7em;
            transition: all 0.2s;
          }
        }
      }

      .productDetail {
        margin-left: 1em;
        flex: 1 1 80%;
        width: 80%;

        .productCode {
          display: block;
          font-size: 1em;
          font-weight: 700;
        }

        .productName {
          display: block;
          font-size: 2.5em;
          text-transform: uppercase;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .description {
          font-size: 1.2em;
          font-weight: 500;
        }

        .price {
          font-size: 2em;
          font-weight: 900;
          letter-spacing: 2px;
        }
        .bid {
          display: block;
          font-size: 1.75em;
          font-weight: 800;
          letter-spacing: 2px;

        }
        
        input {
          display: inline-block;
          border: none;
          border-bottom: 2px solid black;
          font-size: 2em;
          font-family: inherit;
          background: none;
          padding: 8px;

          &:focus {
            outline: none;
            border-bottom: 2px solid #3e6680;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
          }

          &:disabled {
            cursor: not-allowed;

          }
        }

        .make-bid {
          font-family: 'Montserrat',sans-serif;
          font-weight: 600;
          display: inline-block;
          margin: 12px;
          padding: 12px;
          font-size: 1.5em;
          letter-spacing: 1px;
          background-color: #98B9F2;
          border: none;
          border-radius: 8px;
          width: 200px;
          cursor: pointer;

          &:hover {
            box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
          }

          &:disabled {
            cursor: not-allowed;
          }
        }
      }
    }

    .productBuy {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 15%;
      height: auto;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
      border-radius: 8px;
      margin-left: 1em;

      .price {
        font-size: 1.25em;
        font-weight: 600;
        padding: 12px;
      }

      .available {
        font-size: 1.2em;
        font-weight: 600;
        color: #0F956A;
      }
      
      .buttonsContainer{
          display: flex;
          flex-direction: column;
          padding: 10px;
        }

      .addToCart {
          font-family: 'Montserrat',sans-serif;
          font-weight: 600;
          display: inline-block;
          margin: 0.5em;
          padding: 12px;
          letter-spacing: 1px;
          background-color: #B0CFE8;
          border: none;
          border-radius: 8px;
          cursor: pointer;

          &:hover {
            box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
            transition: all 0.15s;
          }
        }
    }
  }
</style>
