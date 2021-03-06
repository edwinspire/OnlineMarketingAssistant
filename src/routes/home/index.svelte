<script>
  import { onMount } from "svelte";
  import { FetchData } from "@edwinspire/fetch/FetchData.js";

  let FData = new FetchData();

 

  async function fetchData() {
    const res = await FData.get("/pgapi/omab/files");
    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      throw new Error(data);
    }
  }

  onMount(async () => {});
</script>

<h1>Asistente</h1>

{#await fetchData()}
  <p>loading</p>
{:then items}
  {#each items as item}
    <div>{item.file_id}</div>

      <div><img src='/telegram/file_id?id={item.file_id}' alt="Italiahhhhhhhhh" /></div>
   
  {/each}
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
