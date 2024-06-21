<script>
  import ProjCard from "./SectionCards/ProjCard.svelte"
  let projects = [
      {
          name:'Black-Scholes Model Calculator',  
          description:'Black-Scholes Model Calculator with a Black-Scholes Model C++ REST-API and SvelteKit front end.',
          link:'https://github.com/premiumfriedrice/AlbaBank',
          skills: [
              'C++', 'Javascript', 'SvelteKit', 'Crow', 'TailwindCSS', 'Docker', 'Vercel'
            ],
          image: 'Black-Scholes Model Calculator',
          imagepath: 'images/bsmc.png'
      },
      {
          name:'PFLPrototype',  
          description:'Aim to help college students manage finances by using modelling.',
          link:'https://github.com/premiumfriedrice/AlbaBank',
          skills: [
              'Python', 'Flask', 'Machine Learning', 'AWS', 'PyTorch'
            ],
          image: 'PFLPrototype',
          imagepath: 'images/PersonalWebsite.png'
      },
      {
          name:'Surge New',  
          description:'My project at Arrive: Reduced engineer workload by 1-2 developer days per sprint by constructing an Internal CLI Tool feature. Feature automated app creation, version control, and CI/CD resulting in a time savings of 14% per 2-week sprint cycle.',
          link:'https://drive.google.com/file/d/1edXoUqSkoK6c2iI1yFhLrZH6O06cH8sG/view?usp=sharing',
          skills: [
              'Python', 'Terminal', 'CI/CD', 'Azure DevOps'
            ],
          image: 'Surge New',
          imagepath: 'images/surge_new.png'
      }
  ]
</script>

<section id="projects" class="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
  <div class="sticky top-0 z-20 -mx-6 mb-4 w-screen backdrop-blur px-6 py-5 md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
      <h2 class="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">Projects</h2>
  </div>
  <div>
      <ol class="group/list">
          {#each projects as project}
          <ProjCard Name={project.name} Link={project.link} Description={project.description} Skills={project.skills} Image={project.image} ImagePath={project.imagepath}/>
          {/each}
      </ol>
  </div>
</section>