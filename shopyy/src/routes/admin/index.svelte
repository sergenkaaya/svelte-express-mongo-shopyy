<script context="module">
    export async function load({fetch,session}) {
        const res = await fetch('http://localhost:3000/api/categories');
        const json = await res.json();
        if(res.ok ){
            return {
                props: {
                    categories: json["categs"],
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
    export let categories = []
    let title=""
    let imagePath=""
    let description=""
    let BuyOutprice =""
    let BidPrice = ""
    let category = ""
    let result =""

    async function addProduct() {
        const res = await fetch("http://localhost:3000/api/products/addproduct",{
            method: "POST",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                title,
                imagePath,
                description,
                BuyOutprice,
                BidPrice,
                category
            }),
        })
        location.reload();
        const json = await res.json();
        result = JSON.stringify(json);     
    }
    
    function currency(price) {
    let priceint = Number(price);
    return priceint.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    } 
</script>

<main>
<label>title<input type="text" bind:value={title}></label>
<label>imagePath<input type="text" bind:value={imagePath}></label>
<label>description<input type="text" bind:value={description}></label>
<label>BuyOutprice<input type="text" bind:value={BuyOutprice}> | {currency(BuyOutprice)}</label>
<label>Bid<input type="text" bind:value={BidPrice}> | {currency(BidPrice)}</label>
<label>category 
    <select bind:value={category}>
        {#each categories as c}
            <option value={c.title}>{c.title}</option>
        {/each}
    </select>
</label>
<button on:click={addProduct}>EKLE</button>
<p> Result : {result}</p>
</main>

<style lang="scss">
    main {
        color : red;
    }
</style>