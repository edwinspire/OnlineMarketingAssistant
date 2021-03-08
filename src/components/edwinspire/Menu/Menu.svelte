<script>
    import { onMount } from "svelte";
  
    let NavOnLine = false;
    let MenuOpen = false;
  
    function ToggleClassMenu() {
      console.log("Toogle");
      MenuOpen = !MenuOpen;
    }

  
    onMount(async () => {  
  
      NavOnLine = window.navigator.onLine;
      console.log(NavOnLine, navigator);
  
      window.addEventListener("offline", (event) => {
        //alert("Esta offline");
        NavOnLine = false;
      });
  
      window.addEventListener("online", (event) => {
        //alert("está online");
        NavOnLine = true;
      });
    });
  </script>
  
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/home">
        <span class="icon">
          <img
            src="logo.png"
            width="20"
            height="20"
            alt="TIENDA ONLINE"
          />
        </span>
  
        <strong> TIENDA ONLINE</strong>
      </a>
      <span class="navbar-item">
        <span
          class="icon"
          class:has-text-success={NavOnLine}
          class:has-text-danger={!NavOnLine}
        >
          <i class="fas fa-wifi" />
        </span>
      </span>
  
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        class:is-active={MenuOpen}
        on:click={ToggleClassMenu}
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>
  
    <div class="navbar-menu" class:is-active={MenuOpen}>
      <div class="navbar-start">
        <a href="/registro_depositos" class="navbar-item">Registro de Depósitos</a>
  
        
        <a href="/facturacion_electronica"  class="navbar-item">Facturación Electrónica</a>
      </div>
  
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-light" href="/"> Logout </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
  