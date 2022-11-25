<script context="module">
    export async function load({params, fetch}) {
        const slug = params.slug;
        const id = params.id;
        console.log(slug);
        const res = await fetch("http://localhost:3000/api/bid/bids",{ credentials:"include"});
        const json = await res.json();

        if(res.ok){
            return {
                props: {
                    bids: json["bids"]
                }
            }
        }

        return {
            status: res.status,
            error: new Error('Başaramadık')
        }
    }
</script>
<script>
    import Icon from "@iconify/svelte";
    export let bids = []
    let BidPrice;

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
      notifications.success(`${BidPrice} değerinde Teklif Başarılı`,2000)
    }
    else {
      notifications.danger(`${result}`,2000)
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
<title>SHOPY : Teklifleriniz</title>
</svelte:head>

<div class="wrapper">
    <div class="bidsContainer">
        <h2>Toplam {bids.length} teklifiniz var.</h2>
        {#each bids as bid}
        <a href={`/products/${bid.category.slug}/${bid._id}`}>
            <div class="bidBox">
                <div class="imgBox">
                    <img src={bid.imagePath} alt="">
                </div>
                <div class="titleBox">
                    {bid.title}
                </div>
                <div class="priceBox">
                    Güncel Teklifiniz: {currency(bid.Bid.price)}
                    <span>
                        <Icon icon="akar-icons:chevron-right" inline={true}/>
                    </span>
                </div>
            </div>
        </a>
        {/each}
    </div>
</div>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');    
    .wrapper {
        width: 100%;
        height: 100%;
        font-family: 'Montserrat',sans-serif;


        .bidsContainer {
            display: flex;
            flex-direction: column;
            margin: 0 auto;
            width: 60%;

            a {
                text-decoration: none;
                color: black;
            }

            .bidBox {
                margin-top: 1em;
                flex-direction: row;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid black;
                width: 100%;
                height: 20%;
                font-size: 1.5em;

                .imgBox {
                    flex: 1;

                    img {
                        width: 3em;
                        margin: 1em 0 1em 2em;
                    }
                }
                .titleBox {
                    flex: 2;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .priceBox {
                    flex: 2;

                    span {
                        float: right;
                        margin-right: 3em;
                    }
                }
                
                h2{
                    margin-left: 2em;
                }
            }
        }
    }
</style>

