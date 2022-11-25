<script>
    import Icon from '@iconify/svelte';
    import { goto } from "$app/navigation";
    import { session } from "$app/stores";
    let searchStr = "";
    let user = $session.user;

    async function logout(){

        const res = await fetch("http://localhost:3000/api/user/logout",{
            method:"POST",
            credentials:"include"
        });
        location.reload();
        goto('/');
    }

</script>

<div class="header">
    <div class="leftHeader">
        <h1><a href="/">SHOPY</a></h1>
    </div>
    <div class="middleHeader">
        <form action="/s/{searchStr}">
            <input class="searchBar" type="text" placeholder="Search.." bind:value={searchStr}>
            <input type="submit" class="searchBtn" value="ARA"/>
        </form>
    </div>
    <div class="rightHeader">
        <nav>
            {#if user == "admin"}
                 <a href="/admin">ADMIN PANEL</a>
            {/if}
            {#if !user}
                <a href="/login">Giriş Yap</a>
                <a href="/register">Kayıt ol</a>
            {:else}
                <a href="/profile"><button class="profilebtn">{user}</button></a>
                <a href="/"><button on:click={logout}>ÇIKIŞ YAP</button></a>
            {/if}        
            <a href="/cart"><Icon icon="el:shopping-cart" inline={true} />SEPET</a>
        </nav>
    </div>
</div>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap'); 
@import url('https://fonts.googleapis.com/css2?family=Iceberg&display=swap');
    
.header {
        background:#1B2845;
        width: 100%;
        font-family: 'Montserrat', sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-basis: 120px;

        .leftHeader {
            height: 100%;
            flex: 1;
            color: #F1F2EB;
            text-align: center;
            
            
            h1 {
                font-family: 'Iceberg', cursive;
                font-size: 2em;

            }
            a {
                color:#F1F2EB;
                text-decoration: none;
                letter-spacing: 2px;
                
            }
        }

        .middleHeader {
            height: 100%;
            flex: 2;
            color:yellow;
            justify-content: center;
            align-items: center;
            form {

                .searchBar {
                    width: 80%;
                    padding: 10px;
                    font-size: 17px;
                    float: left;
                }
                a {
                    text-decoration: none;
                }
                .searchBtn {
                    font-family: 'Montserrat',sans-serif;
                    border: none;
                    padding: 14px;
                    
                    border-radius: 0 8px 8px 0px;

                    &:hover {
                        font-weight: 600;
                        box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
                        transition: box-shadow 0.2s;
                    }
                }
            }

        }

        .rightHeader {
            flex: 2;
            width: 25%;
            float: right;
            color:blue;
            text-align: center;

            button {
                background: none;
                outline: none;
                border: none;
                color:#F1F2EB;
                font-size: 20px;
                font-family: 'Montserrat', sans-serif;
                cursor: pointer;
            }

            a {
                display: inline-block;
                padding: 15px;
                color:#F1F2EB;
                text-decoration: none;
                text-transform: uppercase;
                font-size: 20px;
                border:1px solid transparent;

                &:hover {
                    border: solid 1px #F1F2EB;
                }
            }
        }
    }

</style>