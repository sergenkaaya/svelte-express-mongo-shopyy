<script context="module">
  export async function load({ session }) {
    if (session.user) {
      return {
        status: 302,
        redirect: "/",
      };
    }
    return {};
  }
</script>

<script>
  import { goto } from "$app/navigation";
  import Toast from '$lib/Toast.svelte';
  import { notifications } from '$lib/notifications';

  let username = "";
  let password = "";

  async function submitForm() {
    const res = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
      credentials: "include",
    });
    const json = await res.json();

    if (res.status == 200) {
      notifications.success('Giriş Başarılı. Yönlendiriliyorsunuz',850);
      setTimeout(() => {
        location.reload();
        goto('/');
      }, 850 );
      
    }
    else {
      notifications.danger('Kullanıcı Adı veya Parola Yanlış',850);
    }
  }
</script>

<svelte:head>
<title>SHOPY : Giriş Yap</title>
</svelte:head>

<div class="container">
  <Toast/>
  <form>
    <h3>Giriş Yap</h3>

    <label for="username">Kullanıcı Adı</label>
    <input
      type="text"
      placeholder="Kullanıcı Adı"
      id="username"
      bind:value={username}
    />

    <label for="password">Parola</label>
    <input
      type="password"
      placeholder="Parola"
      id="password"
      bind:value={password}
    />
    <button type="button" on:click={submitForm}>Giriş Yap</button>
    <p>Üye Değil misin ? Hemen <a href="/register">Üye Ol</a></p>
  </form>
  
</div>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');      
  .container {
    width: 100%;
    height: 100%;
    font-family: 'Montserrat', sans-serif;
    padding: 3em 0 7em 0;

    form {
      padding: 5em;
      margin: 0 auto;
      height: 520px;
      width: 400px;
      background-color: #003F91;
      position: relative;
      border-radius: 10px;
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
      padding: 50px 35px;

      * {
        color: #ffffff;
        letter-spacing: 0.5px;
        outline: none;
        border: none;
      }

      h3 {
        font-size: 32px;
        font-weight: 500;
        line-height: 42px;
        text-align: center;
      }

      label {
        display: block;
        margin-top: 30px;
        font-size: 16px;
        font-weight: 500;
      }
      input {
        display: block;
        height: 50px;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.07);
        border-radius: 3px;
        padding: 0 10px;
        margin-top: 8px;
        font-size: 14px;
        font-weight: 300;
      }
      button {
        margin-top: 50px;
        width: 100%;
        background-color: #ffffff;
        color: #080710;
        padding: 15px 0;
        font-size: 18px;
        font-weight: 600;
        border-radius: 5px;
        cursor: pointer;
      }

      p {
          text-align: center;
      }
    }
  }
</style>
