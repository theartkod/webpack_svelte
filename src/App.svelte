<script>
  import page from "page";
  let route = false;

  page("/", () => {
    import(/* webpackChunkName: "main-page" */ "./pages/MainPage.svelte").then(
      m => {
        route = m.default;
      }
    );
  });

  page("/about", () => {
    import(/* webpackChunkName: "about" */ "./pages/About.svelte").then(m => {
      route = m.default;
    });
  });

  page();
</script>

<style>
  @import url("./assets/styles/main.pcss");
</style>

<div class="demo">
  <svelte:component this={route} />
</div>
