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
    import Icon from "@iconify/svelte";
    import CategoriesNav from "$lib/categories-nav.svelte";
    import Header from "$lib/Header.svelte";
    export let categories = [];
</script>

<Header/>
<CategoriesNav categories={categories} />
<div class="content">
    <slot></slot>
</div>
<footer>
<div class="siteMap">
<h2>Güvenli Alışveriş</h2>
<span><Icon icon="brandico:visa" width="64" /></span><span style="margin-left: 1em;"><Icon icon="logos:mastercard" width="64"/></span>
</div>
<div class="about">
<h2>Hakkımızda</h2>
<a href=""><li>Hakkımızda</li></a>
<a href=""><li>Kariyer</li></a>
<a href=""><li>İletişim</li></a>
</div>
<div class="followUs">
<h2>Sosyal</h2>
<a href=""><li><Icon icon="akar-icons:instagram-fill" width="24" />Instagram</li></a>
<a href=""><li><Icon icon="akar-icons:twitter-fill" width="24"/>Twitter</li></a>
<a href=""><li><Icon icon="akar-icons:facebook-fill" width="24"/>Facebook</li></a>
</div>
</footer>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');
    :global(html) {
        height: 100%;
    }

    :global(body) {
        margin: 0;
        min-height: 100%;
    }

    .content {
        min-height: 760px;
        width: 100%;
        background-color: #F6F7F8;
    }

    footer {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: #1B2845;
        width: 100%;
        padding: 2em 0;
        color: #F6F7F8;
        font-family: 'Noto-sans' ,sans-serif;

        a{
            text-decoration: none;
            color: #F6F7F8;

            &:hover {
                text-decoration: underline;
            }
        }

        li {
            list-style: none;
            padding: 5px;
        }

        .siteMap {
            flex: 1;
            margin-left: 2em;
        }

        .about {
            flex: 1;
        }

        .followUs {
            flex: 1;
        }
    }
</style>