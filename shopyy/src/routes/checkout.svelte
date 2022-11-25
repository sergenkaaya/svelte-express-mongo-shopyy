<script context="module">
  export async function load({ fetch, session }) {
    const sessuser = session.user;
        if(!sessuser) {
            return {
                status:301,
                redirect:"/"
            }
        }
    const res = await fetch("http://localhost:3000/api/cart/shopping-cart", {
      method: "GET",
      credentials: "include",
    });

    const json = await res.json();

    if (res.ok) {
      return {
        props: {
          inCartItems: json["cart"].items,
          cartItems: json["cartItems"],
          totalQty: json["cart"].totalQty,
          totalCost: json["cart"].totalCost,
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
  import Icon from '@iconify/svelte';
  import Toast from '$lib/Toast.svelte';
  import { notifications } from '$lib/notifications';
  export let inCartItems = [];
  export let cartItems = [];
  export let totalQty = "";
  export let totalCost = "";

  let cc14;
  let cc48;
  let cc812;
  let cc1216;
  let ccHolder;
  let ccCVV;
  let ccExpMonth;
  let ccExpYear;
  
  async function checkout() {
    let ccNumber = cc14 + cc48 + cc812 + cc1216;
    let ccExpDate = new Date(ccExpYear,ccExpMonth);
    console.log(ccNumber.length)
    console.log(ccHolder.length)
    console.log(ccCVV.length)

    if(ccNumber.length == 16 || ccHolder.length > 3 || ccCVV.length == 3){

    const res = await fetch("http://localhost:3000/api/cart/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ccNumber,
        ccCVV,
        ccHolder,
        ccExpDate
      }),
      credentials: "include",
    });
    
    if(res.status == 200) {
        notifications.success('Sipariş Alındı',1000);
        setTimeout(() => {
        location.reload();
        goto('/');
      }, 1000 );
    }
    else {
        notifications.danger('Hata. Tekrar Deneyin',1000)
    }
  }

  else {
    notifications.danger('Bilgileri lütfen eksiksiz ve doğru doldurunuz', 850)
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
<title>SHOPY : Sipariş Tamamlama</title>
</svelte:head>

<div class="wrapper">
    <Toast></Toast>
  <div class="checkoutCard">
    <div class="leftCard">
      <div class="productsCont">
        {#each cartItems as cartItem}
          {#each inCartItems as inCartItem}
            {#if cartItem.productCode == inCartItem.productCode}
              <div class="cartProduct">
                <div class="imgBox">
                  <img class="itemImg" src={cartItem.imagePath} />
                </div>
                <div class="titleBox">
                  <span class="title">{cartItem.title}</span><br />{currency(
                    cartItem.BuyOutprice
                  )}
                </div>
                <div class="qtyBox">x {cartItem.qty}</div>
                <div class="priceBox">
                  <span class="price">{currency(inCartItem.price)}</span>
                </div>
              </div>
            {/if}
          {/each}
        {/each}
      </div>
      <div class="totalBox">
        Toplam : {currency(totalCost)}
      </div>
    </div>
    <div class="rightCard">
        <h2>ÖDEME <span><Icon icon="simple-icons:visa" width="48" inline={true}/></span><span><Icon icon="logos:mastercard" width="48" inline={true} /></span></h2>
        
        <form action="">
            <label for="">Kart Numarası</label>
            <div id="cardnumber">
                <input type="tel" inputmode="numeric" pattern="[0-9]{4}" max="9999" maxlength="4" min="4"  bind:value={cc14} placeholder="0123" /> <span class="divider">-</span>
                <input type="tel" inputmode="numeric" pattern="[0-9]{4}" max="9999" maxlength="4" min="4" bind:value={cc48} placeholder="4567" /> <span class="divider">-</span>
                <input type="tel" inputmode="numeric" pattern="[0-9]{4}" max="9999" maxlength="4" min="4" bind:value={cc812} placeholder="8901" /> <span class="divider">-</span>
                <input type="tel" inputmode="numeric" pattern="[0-9]{4}" max="9999" maxlength="4" min="4" bind:value={cc1216} placeholder="2345" />
            </div>
            <label for="">Kart Üzerindeki Ad</label>
            <input id="cardholder" type="text" bind:value={ccHolder} placeholder="John Doe" />
            <div class="left">
                <label for="">Son Kullanma Tarihi</label>
                <select name="month" id="month" bind:value={ccExpMonth} onchange="" size="1">
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
                </select>
                <select name="year" id="year" bind:value={ccExpYear} onchange="" size="1">     
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
                </select>
            </div>
            
            <div class="right">
                <label id="cvc-label" for="">CVC/CVV <Icon icon="ei:question" inline={true} width="24" /></label>
                <input id="cvc" type="tel" inputmode="numeric" pattern="[0-9]{3}" bind:value={ccCVV} placeholder="123" maxlength="3" />
            </div>
            <button id="purchase" type="button" on:click={checkout}
            
            >İşlemi Tamamla</button>
            <p id="support">Sorun mu yaşıyorsun? <a href="#">Destek ile iletişime geç.</a>.</p>
        </form>
    </div>
  </div>
</div>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');
  .wrapper {
    width: 100%;
    height: 100%;
    font-family: 'Montserrat', sans-serif;

    .checkoutCard {
      height: 520px;
      width: 1060px;
      margin: 0 auto;
      display: flex;

      .leftCard {
        width: 45%;
        height: 100%;
       
        flex: 1;
        font-family: "Montserrat", sans-serif;

        .productsCont {
          width: 100%;
          height: 80%;
          overflow: auto;

          .cartProduct {
            padding: 1em 0 1em 0;
            display: flex;
            width: 100%;
            height: 15%;
            border-bottom: 1px solid lightgray;
            justify-content: center;
            align-items: center;
            text-align: center;

            .imgBox {
              flex: 1;

              img {
                width: 3em;
              }
            }
            .titleBox {
              flex: 2;
              text-align: center;

              .title {
                text-transform: uppercase;
                font-weight: 700;
              }
            }
            .qtyBox {
              flex: 1;
            }
            .priceBox {
              flex: 1;
              padding-right: 2em;

              .price {
                font-weight: 800;
              }
            }
          }
        }
        .totalBox {
            padding-top: 2em;
            text-align: center;
            font-weight: 900;
            font-size: 1.2em;
            border-top: 1px solid black;
        }
      }

      .rightCard {
        height: 100%;
        width: 55%;
        font-family: 'Noto-sans',sans-serif;
        font-size: 1em;

        h2 {
            margin-left: 2em;
            letter-spacing: 1px;

            span { 
                float:right;
                padding-right: 1em;
            }
        }

        form {
            margin: 40px auto 0;
            width: 90%;

            #cardnumber {
                background: white;
				padding: 4px 6px;
				border-radius: 3px;
				border: 1px solid lightgrey;

                input {
                display: inline-block;
                width: 100px;
                padding: 4px 6px;
                letter-spacing: 6px;
                font-size: 0.9em;
                border: none;
                background: none;
                text-align: center;

                &::-webkit-input-placeholder {
                    opacity: 0.5;
                }
                &[type=tel]::-webkit-inner-spin-button,[type=tel]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
              }
              span.divider {
                    color: rgba(0, 0, 0, .3);
                }      
            }

            label {
                display: block;
                font-size: 0.7em;
                font-weight: 600;
                text-transform: uppercase;
                margin: 14px 0 4px;
            }

            input {
                display: block;
                padding: 6px 8px;
                border: 1px solid lightgrey;
                border-radius: 2px;
                font-size: 0.9em;

                &:focus {
                    outline: none;
                    border-color: #094D92;
                }
                &::-webkit-input-placeholder{
                    opacity: 0.5;
                }
                &#cardholder {
					width: 80%;
				}
						
				&#cvc {
					
				}
            }
            select {
				border: 1px solid lightgrey;
				border-radius: 2px;
				background: none;
				width: 90px;
				font-weight: 500;
				font-size: 0.9em;
			    padding: 6px 8px;
				color: rgba(0, 0, 0, .2);
				-webkit-appearance: none;
   			    -moz-appearance: none;
   				appearance: none;
			}
            button {
				display: block;
				width: 100%;
				border: none;
				border-radius: 2px;
				padding: 8px 0;
				font-size: 0.8em;
						
				&#purchase {
					background: #094D92;
					color: white;
					margin-top: 1em;
					font-size: 0.9em;
				}
			}

            
            
        }
      }
    }
  }
</style>
