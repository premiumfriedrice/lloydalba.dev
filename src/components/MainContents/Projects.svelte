<script>
  import ProjCard from "./SectionCards/ProjCard.svelte"
  let projects = [
      {
          name:'findMoto 🏍️',  
          description:'Facebook Marketplace webscraper tailored for finding best motorcycle deals.',
          link:'https://github.com/amasud7/findMoto',
          skills: [
              'Python', 'Terminal', 'Argeparse'
            ],
          image: 'Black-Scholes Model Calculator',
          imagepath: 'images/findMoto_demo.gif'
      },
      {
          name:'Anvil Game Engine',  
          description:'Implementing an Entity-Component System.',
          link:'https://github.com/premiumfriedrice/PRIVATE',
          skills: [
              'C++', 'Vulkan', 'Metal', 'MoltenVK'
            ],
          image: 'Black-Scholes Model Calculator',
          imagepath: 'images/Anvil.png'
      },
      {
          name:'Black-Scholes Model Calculator',  
          description:'Black-Scholes Model Calculator with a Black-Scholes Model C++ REST-API and SvelteKit front end.',
          link:'https://github.com/premiumfriedrice/BlackScholesModelCalculator',
          skills: [
              'C++', 'Javascript', 'SvelteKit', 'Crow', 'TailwindCSS', 'Docker'
            ],
          image: 'Black-Scholes Model Calculator',
          imagepath: 'images/bsmc.png'
      },
      {
          name:'PFLPrototype',  
          description:'Helping students manage their finances.',
          link:'https://github.com/premiumfriedrice/PFLPrototype',
          skills: [
              'Python', 'Flask', 'Machine Learning', 'AWS', 'PyTorch'
            ],
          image: 'PFLPrototype',
          imagepath: 'images/PersonalWebsite.png'
      },
      {
          name:'Surge New · Arrive Logistics',  
          description:'Internal CLI Tool feature that streamlined project scaffolding by fully automating version control, REST-API .NET template app creation, and CI/CD pipelines. Achieved a 14% reduction in development time resulting in $38,400 annual savings in engineer salary costs.',
          link:'https://drive.google.com/file/d/11D9j2wbfckiiUenRMl5at5TqRkMnPtzd/view?usp=sharing',
          skills: [
              'Python', 'Terminal', 'CI/CD', 'Azure DevOps', 'Argeparse'
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