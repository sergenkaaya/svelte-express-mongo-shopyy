<script context="module">
  export async function load({ session, fetch }) {
    const sessuser = session.user;
    if (!sessuser) {
      return {
        status: 302,
        redirect: "/",
      };
    }
    else {
    const res = await fetch("http://localhost:3000/api/cart/orders", {
      method: "GET",
      credentials: "include",
    });
    const json = await res.json();
    console.log(json["orders"]);
    if (res.ok) {
      return {
        props: {
          orders: json["orders"],
          products: json["products"]
        },
      };
    }

    return {
      status: res.status,
      error: new Error("Başaramadık"),
    };
  }
  }
</script>

<script>
import CollapsibleCard from "$lib/CollapsibleCard.svelte";
import Icon from "@iconify/svelte";
export let orders = [];
export let products =[];


function currency(price) {
    let priceint = Number(price);
    return priceint.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
}

function formatStr(cc) {
  let ccStr = cc.toString();
  return "***" + ccStr.slice(ccStr.length-4,ccStr.length);
}


function formatDate(ddmmyy) {
    let dd = new Date(ddmmyy)
    return dd.toLocaleString('default',{day:'numeric',month:'long',year:'numeric'})
}
</script>

<svelte:head>
<title>SHOPY : Siparişleriniz</title>
</svelte:head>

<div class="wrapper">
  <div class="ordersContainer">
    <h2>Toplam {orders.length} siparişiniz bulunmaktadır.</h2>
    
    {#each orders as order, i}
    
    <CollapsibleCard headerText={order.orderCode} orderDate={formatDate(order.createdAt)} orderCost={currency(order.cart.totalCost)} >
        <div class="content">
                <div class="cart">
                <ul> Sipariş İçeriği
                    {#each products[i] as product}
                    {#each order.cart.items as item}
                    {#if item.productCode == product.productCode}          
                        <a href={`/products/${product.category.slug}/${product._id}`}>
                            <li><img src={product.imagePath} alt=""><span>{item.title} x {item.qty}</span> <span>{currency(item.price)}</span></li>
                        </a>
                    {/if}
                    {/each} 
                    {/each}
                    
                </ul>
                
                </div>
                <div class="payment">
                    <ul> Ödeme Özeti <span><Icon icon="simple-icons:visa" width="48" inline={true}/></span><span><Icon icon="logos:mastercard" width="48" inline={true} /></span>
                        <li>Kredi kartı: {formatStr(order.paymentInfo.creditCardNumber)}</li>
                        <li>Kredi kart üzerindeki isim: {order.paymentInfo.creditCardHolder}</li>
                    </ul>
                    <hr>
                    <span class="delivered">Teslim Edildi mi ? : {#if order.Delivered == true}
                        <span style="color:green ;"> EVET</span>
                    {:else}
                        <span style="color:red ;"> HAYIR</span>
                    {/if}</span>
                </div>
        </div>
    </CollapsibleCard>
    
    {/each}
  </div>
</div>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
  .wrapper {
    width: 100%;
    height: 100%;
    font-family: 'Montserrat', sans-serif;
    
    .ordersContainer{
        width: 70%;
        display: flex;
        flex-direction: column;
        margin: 0 auto;

        .content {
            display: flex;
            width: 100%;
            height: 260px;
            margin-bottom: 20px;

            .cart {
                flex: 1;
                overflow: auto;
                
                a{
                    text-decoration: none;
                    color: black;
                }
                
                ul {
                    font-size: 1.1em;
                    display: flex;
                    flex-direction: column;
                    li {
         
                        flex: 1;
                        flex-direction: row;
                        list-style: none;
                        padding: 10px 6px;

                        img {
                            width: 3em;
                        }

                        span {
                            flex: 2;
                            margin-left: 1em;
                        }
                    }
                }
            }
            .payment {
                flex: 1;

                ul {
                    font-size: 1.1em;
                    
                    li {
                        font-size: 1.3em;
                        padding: 10px 6px;
                    }
                    span {
                        float: right;
                        margin-left: 10px;
                    }
                }

                .delivered {
                  margin: 2em;
                  font-size: 1.1em;
                  font-weight: 400;
                }
            }
        }
    }
  }
</style>
