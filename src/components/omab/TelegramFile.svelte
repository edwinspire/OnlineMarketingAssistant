<script>
  import { onMount } from "svelte";
  import  ModalConfirmationDelete  from "../edwinspire/Message/ModalConfirmation.svelte";
  import  ModalConfirmationPublish  from "../edwinspire/Message/ModalConfirmation.svelte";
  import {FetchData} from "@edwinspire/fetch/FetchData.js";
  export let idfile;
  let show = true;
  let show_confirmation_delete = false;  
  let show_confirmation_publish = false;  
  let file_id = '';
  let name = '';
  let provider = '';
  let purchase_price = 0;
  let sale_price = 0;
  let description = '';
  let FData = new FetchData();

async function DeleteFile() {
    try {
      const res = await FData.delete("/pgapi/omab/file", {idfile: idfile}, {
      'Content-Type': 'application/json'
    });
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      show = false;
      show_confirmation_delete = false;
    }
    } catch (error) {
     console.error(error); 
    } 
  }


async function GetDataFile() {
     try {
      const res = await FData.get("/pgapi/omab/file", {idfile: idfile}, {
      'Content-Type': 'application/json'
    });
    const data = await res.json();
//console.log(data);
    if (res.ok) {
      if(data.length > 0){
    let row = data[0];
    file_id = row.file_id;
    name = row.name;
    provider = row.provider;
    purchase_price = row.purchase_price;
    sale_price = row.sale_price;
    description = row.description;

      }
    }
    } catch (error) {
     console.error(error); 
    }
  }

  async function Publish() {
    try {
      const res = await FData.post("/pgapi/omab/publish", {idfile: idfile, receiver: -1001294652029}, {
      'Content-Type': 'application/json'
    });
    const data = await res.json();
console.log(data);
    if (res.ok) {
      show_confirmation_publish = false;
    }
    } catch (error) {
     console.error(error); 
    } 
  }

  async function SaveData() {
    
    try {
      const res = await FData.post("/pgapi/omab/file", {idfile: idfile, name: name, provider: provider, purchase_price: purchase_price, sale_price: sale_price, description: description}, {
      'Content-Type': 'application/json'
    });
    const data = await res.json();
console.log(data);
    if (res.ok) {
      if(data.length > 0){
    let row = data[0];
    file_id = row.file_id;
    name = row.name;
    provider = row.provider;
    purchase_price = row.purchase_price;
    sale_price = row.sale_price;
    description = row.description;

      }
    }
    } catch (error) {
     console.error(error); 
    } 
  }

  onMount(async () => {
    await GetDataFile();
  });

</script>



{#if show}

<div class="card">
  <div class="card-image">
    <figure class="image is-4by3">
      <img src="/telegram/file_id?id={file_id}" alt="Producto" />
    </figure>
  </div>
  <div class="card-content">
    <div class="content">
      <div class="field">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label">Nombre Producto</label>
        <div class="control">
          <input class="input" type="text" bind:value="{name}" placeholder="Nombre del producto" />
        </div>
      </div>

      <div class="field">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label">Proveedor</label>
        <div class="control has-icons-left has-icons-right">
          <input class="input" type="text" placeholder="Proveedor" bind:value="{provider}" />
          <span class="icon is-small is-left">
            <i class="fas fa-user-tie" />
          </span>
        </div>
      </div>

      <div class="field">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label">Precio Compra</label>
        <div class="control has-icons-left has-icons-right">
          <input class="input" type="number" placeholder="Precio" bind:value="{purchase_price}" />
          <span class="icon is-small is-left">
            <i class="fas fa-dollar-sign" />
          </span>
        </div>
      </div>

      <div class="field">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label">Precio Venta</label>
        <div class="control has-icons-left has-icons-right">
          <input class="input" type="number" placeholder="Precio" bind:value="{sale_price}" />
          <span class="icon is-small is-left">
            <i class="fas fa-dollar-sign" />
          </span>
        </div>
      </div>

      <div class="field">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label">Descripción</label>
        <div class="control">
          <textarea class="textarea" placeholder="Textarea" bind:value="{description}"></textarea>

        </div>
      </div>
    </div>
  </div>

  <footer class="card-footer">
    <span class="card-footer-item" on:click={SaveData}>Guardar</span>
    <span class="card-footer-item" on:click={()=>{
      show_confirmation_delete = true;
    }}>Eliminar</span>
    <span class="card-footer-item" on:click={()=>{
      show_confirmation_publish = true;
    }}>Publicar</span>
  </footer>
</div>

{/if}



<ModalConfirmationDelete bind:Show={show_confirmation_delete} on:ok="{DeleteFile}" on:cancel={()=>{
      show_confirmation_delete = false;
}}>
	<span slot="title">
		ELIMINAR
	</span>

	<div slot="body">
<div>Una vez eliminado no podrá recuperar la información.</div>
		Realmente desea eliminar el registro?
  </div>
</ModalConfirmationDelete> 


<ModalConfirmationPublish bind:Show={show_confirmation_publish} on:ok="{Publish}" on:cancel={()=>{
  show_confirmation_publish = false;
}}>
<span slot="title">
PUBLICAR
</span>

<div slot="body">
Realmente desea publicar el producto?
<div>{name} a ${sale_price}</div>
</div>
</ModalConfirmationPublish> 