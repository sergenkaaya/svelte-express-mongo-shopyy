<script context="module">
    export async function load({params,fetch}) {
        const searched = params.searched;
        console.log(searched);
        const url = `http://localhost:3000/api/products/search?search=${searched}`
        console.log(url);
        const res = await fetch(url,{method:'POST'});
        const json = await res.json();

        if(res.ok) {
            return {
                props: {
                    products: json["products"]
                }
            }
        }
        return {
            status: res.status,
            error : new Error("Bulunamadı.")
        }
    }
</script>

<script>
import ProductCard from "$lib/ProductCard.svelte";
export let products = [];

</script>

<svelte:head>
<title>SHOPY : Arama Sonuçları</title>
</svelte:head>

<main>
    <ProductCard {products} />
</main>