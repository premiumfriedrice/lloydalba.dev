<script>
    import ExpCard from "./SectionCards/ExpCard.svelte"
    let experiences = [
        {
            time:'Summer 2024', 
            position:'Software Engineer Intern, Platform', 
            company:{
                name:'Arrive Logistics', 
                link:'https://www.arrivelogistics.com/'
            }, 
            description:'Currently migrating classic GUI Azure DevOps pipelines from classic to YAML-based pipelines as code. Collaborating with cross-functional teams to troubleshoot and resolvecritical issues with microservices.',
            skills:['Terraform', 'YAML', 'CI/CD', 'Terminal', 'Azure DevOps']
        },
        {
            time:'Summer 2023', 
            position:'Software Engineer Intern, Platform', 
            company:{
                name:'Arrive Logistics', 
                link:'https://www.arrivelogistics.com/'
            }, 
            description:'Developed an Internal CLI Tool feature that remains a crucial part of the company’s developer workflow, reducing engineer workload by 1-2 developer days per sprint and significantly improving development efficiency. Achieved a 14% reduction in development time resulting in $38,400 annual savings in engineer salary costs',
            skills:['Python', 'Automation', 'CI/CD', 'Terminal', 'Azure DevOps']
        }
    ]
</script>

<section id="experience" class="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
    <div class="sticky top-0 z-20 -mx-6 mb-4 w-screen backdrop-blur px-6 py-5 md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 class="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">Experience</h2>
    </div>
    <div>
        <ol class="group/list">
            {#each experiences as experience}
            <ExpCard Time={experience.time} Position={experience.position} Company={experience.company} Description={experience.description} Skills={experience.skills}/>
            {/each}
        </ol>
        <div class="mt-12">
            <a class="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-cyan-300 focus-visible:text-teal-300 font-semibold text-slate-200 group/link text-base" href="documents/resume.pdf" target="_blank" rel="noreferrer noopener" aria-label="View Full Résumé (opens in a new tab)">
                <span>View Full 
                    <span class="inline-block">Résumé<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px" aria-hidden="true"><path fill-rule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clip-rule="evenodd"></path></svg></span>
                </span>
            </a>
        </div>
    </div>
</section>