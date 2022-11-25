<script context="module">

export async function load({session, fetch}) {
        const sessuser = session.user;
        if(!sessuser) {
            return {
                status:301,
                redirect:"/"
            }
        }
        const res = await fetch("http://localhost:3000/api/user/get-user-info",{ 
            method:"GET",
            credentials:"include"
        });
        const json = await res.json();
        if(res.ok){
            return {
                props: {
                    user: json["user"]["username"],
                    email: json["user"]["email"],
                    passw:json["user"]["password"],
                    userBids: json["userBids"],
                    userOrders: json["userOrders"]
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
import { goto } from '$app/navigation';
import { notifications } from '$lib/notifications';
import Toast from '$lib/Toast.svelte';
import Icon from '@iconify/svelte';
export let user;
export let email;
export let password ="";
$: pswlength = password.length
export let passwordcheck;
export let userBids = [];
export let userOrders = [];

async function changePassword() {
    if(password.length < 6) {
        notifications.danger("Parola 6 karakter veya daha uzun olmalı.",'850')
    }
    else if(password != passwordcheck) {
        notifications.danger("Parolalar eşleşmiyor",'850');
    }
    else {
    const res = await fetch("http://localhost:3000/api/user/update-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
      }),
      credentials: "include",
    });
    const json = await res.json();
    
    if (res.status == 200) {
      notifications.success('Güncellendi, Anasayfaya yönlendirilyorsunuz Tekrar giriş yapınız',850);
      setTimeout(() => {
        logout();
      }, 850 );
      
    }
    else {
      notifications.danger('Hata oluştu',850);
    }
} 
}
async function logout(){

const res = await fetch("http://localhost:3000/api/user/logout",{
    method:"POST",
    credentials:"include"
});
location.reload();
goto('/');
}

</script>

<svelte:head>
<title>SHOPY : Profiliniz</title>
</svelte:head>

<div class="wrapper">
    <Toast/>
    <div class="container">
        <div class="userCard">
            <div class="userInfoBox">
                <h2>Merhaba {user} ,</h2>
                <hr>
                <h3>Email : {email}</h3>
                <h3>Parola Değiştir :</h3> Yeni Parola : <input type="password" bind:value={password}> Parola Tekrar : <input type="password" bind:value={passwordcheck}>
                <button id="psw-change" on:click={changePassword}>Parolayı Güncelle</button>
                <span>
                {#if pswlength < 5}
                    <Icon color="red" icon="akar-icons:circle-x-fill" /> Parola en az 6 karakter olmalı.
                {:else}
                    {#if password != passwordcheck}
                    <Icon color="red" icon="akar-icons:circle-x-fill" /> Parolalar eşleşmiyor.
                    {:else}
                    <Icon color="green" icon="akar-icons:circle-check-fill" /> Eşleşiyor.
                    {/if}
                {/if}
                </span>
                
            </div>
            <div class="userOrdersBox">
                <a href="/profile/orders"><button>Toplam {userOrders.length} siparişiniz bulunmaktadır.<span><Icon icon="ic:baseline-arrow-forward-ios" /></span></button></a>
            </div>
            <div class="userBidsBox">
                <a href="/profile/bids"><button>Toplam {userBids.length} teklifiniz bulunmaktadır.<span><Icon icon="ic:baseline-arrow-forward-ios" /></span></button></a>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");    
.wrapper {
    
    width: 100%;
    height: 100%;
    font-family: 'Montserrat',sans-serif;

    .container {
        width: 60%;
        margin: 0 auto;

        .userCard {
            padding-top: 2em;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            h3{margin-top: 2em; margin-bottom: 0;}

            span { display: block;}

            input {
                font-size: 1.1em;
                padding: 4px;
                border:1px solid lightgray;

                &:focus {
                    border:1px solid #094D92;
                    outline: none;
                }
            }

            a{
                text-decoration: none;
            }

            #psw-change {
                display: inline-block;
                width: auto;
                font-size: 0.9em;
                padding: 10px;
                margin-left: 1em;
                font-weight: bold;
                border:1px solid rgba($color: #000000, $alpha: 0);

                &:hover {
                    border:1px solid #094D92;
                }
            }
            button {
                font-family: 'Montserrat',sans-serif;
                margin-top: 1em;
                display: block;
                cursor: pointer;
                padding: 18px;
                width: 100%;
                border: none;
                outline: none;
                font-size: 1.1em;

                span {
                    float:right;
                }
            }

            .userInfoBox {
                width: 100%;
                flex: 1;
            }
            .userOrdersBox {
                width: 100%;
                flex: 1;
            }
            .userBidsBox {
                width: 100%;
                flex: 1;
            }
        }
    }
}
</style>