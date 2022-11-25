<script context="module">
  export function load({ error, status }) {
    return {
      props: {
        msg: `${error.message}`,
        code: `${status}`
      },
    };
  }
</script>

<script>
    export let code = "";
    export let msg = "";
</script>

<svelte:head>
<title>SHOPY : {code}</title>
</svelte:head>

<div class="container">
    <h1>- {code} -</h1>
    <h3>{msg}</h3>
</div>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto+Mono');    
    .container {
        width: 100%;
        height: 100%;
        font-family: 'Roboto-Mono',monospace;
        text-align: center;
        font-size: 28px;

        h1,h3 {
          margin: 0;
          padding-top: 2em;
        }
    }
</style>