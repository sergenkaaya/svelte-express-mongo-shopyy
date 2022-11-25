<script context="module">
  export async function load({ fetch }) {

    const res = await fetch("http://localhost:3000/api/cart/shopping-cart", {
      method: "GET",
      credentials: "include",
    });

    const json = await res.json();


    if (res.status == 200) {
      if(json["cart"] != null) {
        return {
          props: {
            inCartItems: json["cart"].items,
            cartItems: json["cartItems"],
            totalCost: json["cart"].totalCost,
          },
        };
      }
      else {
        return json
      } 
    }
    return {
      status: res.status,
      error: new Error("Başaramadık"),
    };
}
</script>

<script>
  import { session } from "$app/stores";
  import { notifications } from "$lib/notifications";
  import Toast from "$lib/Toast.svelte";
  import Icon from "@iconify/svelte";

  export let sessuser = $session.user;
  export let inCartItems = [];
  export let cartItems = [];
  export let totalCost = "";

  async function reduceItem(itemid) {
    const res = await fetch(`http://localhost:3000/api/cart/reduce/${itemid}`, {
      method: "POST",
      credentials: "include",
    });
    const json = await res.json();
    if (res.ok) {
      location.reload();
      return json;
    }
    return {
      error: new Error("sadge"),
    };
  }

  async function removeItem(itemid) {
    const res = await fetch(
      `http://localhost:3000/api/cart/removeAll/${itemid}`,
      { method: "POST", credentials: "include" }
    );
    const json = await res.json();
    if (res.status == 200) {
      location.reload();
      return json;
    }
    return {
      error: new Error("Hata"),
    };
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
<title>SHOPY : Sepetiniz</title>
</svelte:head>

<main>
  <div class="wrap">
    <Toast />
    {#if !inCartItems.length}
    <div class="emptyCart">
      Sepetiniz Boş
    <a href="/products">Ürünlere Göz Atın <span><Icon icon="akar-icons:chevron-right" inline={true} /></span></a>
    </div>  
    {:else}
    <div class="cart">
      {#each cartItems as cartItem}
        {#each inCartItems as inCartItem}
          {#if cartItem.productCode == inCartItem.productCode}
            <ul class="cartWrap">
              <li class="items">
                <div class="infoWrap">
                  <div class="cartSection">
                    <img class="itemImg" src={cartItem.imagePath} />
                    <p class="item_id">{cartItem.productCode}</p>
                    <h3>{cartItem.title}</h3>
                    <p>
                      {cartItem.qty}
                      <button on:click={reduceItem(inCartItem.productId)}
                        >-</button
                      >
                      x {currency(cartItem.BuyOutprice)}
                    </p>
                  </div>
                  <div class="prodTotal cartSection">
                    <p>{currency(inCartItem.price)}</p>
                  </div>
                  <div class="cartSection removeWrap">
                    <a
                      on:click={removeItem(inCartItem.productId)}
                      class="remove">X</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          {/if}
        {/each}
      {/each}
    </div>
    <div class="total">
      <span class="label">Total</span><span class="value"
        >{currency(totalCost)}</span
      >
      {#if sessuser}
      <a href="/checkout" disabled={totalCost} class="checkout">Checkout</a>
      {:else}
         <span class="goLogin">**Devam etmek için giriş yapmalısın <a href="/login">Giriş Yap</a></span>
      {/if}
      
    </div>
    {/if}
  </div>
</main>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");
  $fontSans: "Montserrat", sans-serif;
  .wrap {
    width: 75%;
    height: 100%;
    max-width: 960px;
    margin: 0 auto;
    font-family: $fontSans;
  }

  .emptyCart {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    top: 25%;
    left: 40%;
    position: absolute;
    font-size: 3em;
    font-weight: 700;

    a {
      text-decoration: none;
      color: #777777;
      font-size: 0.4em;

      &:hover {
        text-decoration: underline;
      }

    }
  }

  .cart {
    padding: 1em 0;

    .items {
      display: block;
      width: 100%;
      padding: 1.5em;
      border-bottom: solid 1px black;

      .infoWrap {
        display: table;
        width: 100%;
        height: 100%;
      }

      .cartSection {
        display: table-cell;
        vertical-align: middle;
        width: 100%;
        height: 100%;

        .item_id {
          font-size: 0.75em;
          color: #777;
          margin-bottom: 0.5em;
        }

        h3 {
          font-size: 1em;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        p {
          display: inline-block;
          font-size: 0.85em;
          color: #777777;
        }

        .itemImg {
          width: auto;
          float: left;
        }

        &.prodTotal {
          text-align: center;
          padding: 2em;  
          p {
            font-weight: bold;
            font-size: 1.25em;
          }
        }

        .itemImg {
          display: inline;
          padding-right: 1em;
        }
      }
    }
  }

  .total {
    margin-left: auto; 
    margin-right: 0;
    width: 35%;
    padding-bottom: 2em;

    .goLogin {
      display: inline-block;
      margin-top: 10px;
     
      a {
        text-decoration: underline;
        color: black;
        font-family: 600;
      }
    }
    
    span {
      display: inline-block;
      padding: 0 0 0 1em;
      text-align: right;
    }
    .label {
      font-family: $fontSans;
      font-size: 1.1em;
      text-transform: uppercase;
      color: #777;
    }
    .value {
      letter-spacing: -.025em;
      width: 35%;
    }
    .checkout {
      display: inline-block;
      margin: 1em 0 1em 2em;
      text-decoration: none;
      font-family: $fontSans;
      font-size: 1em;
      padding: 1em 3em;
      color: #fff;
      background: #003F91;
      font-weight: bold;
      border-radius: 50px;

      &:hover {
        background-color: #39A2AE;
        transition: background-color 100ms linear;
      }
    }
}
  a.remove {
    text-decoration: none;
    font-family: "Courier New", Courier, monospace;
    color: #ffffff;
    font-weight: bold;
    background: #e0e0e0;
    padding: 0.5em;
    font-size: 0.75em;
    display: inline-block;
    border-radius: 100%;
    line-height: 0.85;
    cursor: pointer;
    &:hover {
      background: #f30;
    }
  }
</style>
