<script>
  import { onMount } from "svelte";
  import { FetchData } from "@edwinspire/fetch/FetchData.js";
  import Menu from "../../components/edwinspire/Menu/Menu.svelte";
  import TelegramFile from "../../components/omab/TelegramFile.svelte";

  let FData = new FetchData();


  async function fetchData() {
    const res = await FData.get("/pgapi/omab/files", {}, {
      'Content-Type': 'application/json'
    });
    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      throw new Error(data);
    }
  }

  onMount(async () => {});
</script>

<Menu />
{#await fetchData()}
  <p>Buscando productos...</p>
{:then items}
  <div class="columns is-multiline">
    {#each items as item}
      <div class="column is-4-desktop">
        <TelegramFile
          idfile={item.idfile}
        />
      </div>
    {/each}
  </div>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

