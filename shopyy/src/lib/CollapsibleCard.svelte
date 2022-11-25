<script>
    import Icon from "@iconify/svelte";
    export let headerText;
    export let orderDate;
    export let orderCost;

    let expanded = false
</script>

<div class="collapsible">
    <h3>
        <button aria-expanded={expanded} on:click={() => expanded = !expanded}>
            {headerText}
            <span class="cont">
                <span class="xsmoll">Sipariş Tarihi</span> 
                <span class="smoll">{orderDate}</span>
            </span>
            <span class="cont">
                <span class="xsmoll">Toplam</span> 
                <span class="smoll">{orderCost}</span>
            </span>
            <Icon icon="akar-icons:arrow-down" />
        </button>
    </h3>
    
    <div class='contents' hidden={!expanded}>
        <slot></slot>
    </div>
</div>

<style lang="scss">
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');
  .collapsible {
    border-bottom: 1px solid var(--gray-light, #eee);
    font-family: 'Noto-sans', sans-serif;
  }
	
	h3 {
		margin: 0;
	}
	
  button {
        background-color:#125E8A;
        color:#fff;
        display: flex;
	    justify-content: space-between;
        align-items: center;
        width: 100%;
	    border: none;
	    margin: 0;
	    padding: 1em 0.5em;
        font-size: 1.1em;
        letter-spacing: 1px;

        .cont {
            display: flex;
            flex-direction: column;
            font-size: 0.9em;
            
            .xsmoll {
                flex: 1;
                text-transform: uppercase;
                font-size: 0.7em;
            }
            .smoll {
                flex: 2;
                font-size: 1em;
            }
        }
    }

  button[aria-expanded="true"] {
    border-bottom: 1px solid var(--gray-light, #eee);
  }

    button[aria-expanded="true"] .vert {
        display: none;
    }

    button:focus svg{
        outline: 2px solid;
    }

    button [aria-expanded="true"] rect {
        fill: currentColor;
    }

    svg {
        height: 0.7em;
				width: 0.7em;
    }
</style>