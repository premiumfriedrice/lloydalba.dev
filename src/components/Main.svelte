<script>
  import About from "./MainContents/About.svelte";
  import Experience from "./MainContents/Experience.svelte";
  import Projects from "./MainContents/Projects.svelte";
  import Footer from "./Footer.svelte";
</script>

<main id="content" class="pt-24 lg:w-1/2 lg:py-24">
  
  <section id="about" class="mb-16 scroll-mt-24">
    <About />
  </section>

  <section id="experience" class="mb-16 scroll-mt-24">
    <Experience />
  </section>

  <section id="projects" class="mb-16 scroll-mt-24">
    <Projects />
  </section>

  <Footer />
</main>