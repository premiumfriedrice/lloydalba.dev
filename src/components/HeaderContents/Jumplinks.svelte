<script>
  let activeSection = ''; // Initialize with an empty string or the default active section

  function handleClick(section) {
    activeSection = section;
  }
</script>

<nav class="nav hidden lg:block">
  <ul class="mt-16 w-max">
    <li>
      <a href="#about" class="group flex items-center py-3" on:click={() => handleClick('about')}>
        <span class="nav-text text-xs font-bold uppercase tracking-widest group-hover:text-slate-200 group-focus-visible:text-slate-200" class:text-slate-200={activeSection === 'about'} class:text-slate-500={activeSection !== 'about'}>About</span>
      </a>
    </li>
    <li>
      <a href="#experience" class="group flex items-center py-3" on:click={() => handleClick('experience')}>
        <span class="nav-text text-xs font-bold uppercase tracking-widest group-hover:text-slate-200 group-focus-visible:text-slate-200" class:text-slate-200={activeSection === 'experience'} class:text-slate-500={activeSection !== 'experience'}>Experience</span>
      </a>
    </li>
    <li>
      <a href="#projects" class="group flex items-center py-3" on:click={() => handleClick('projects')}>
        <span class="nav-text text-xs font-bold uppercase tracking-widest group-hover:text-slate-200 group-focus-visible:text-slate-200" class:text-slate-200={activeSection === 'projects'} class:text-slate-500={activeSection !== 'projects'}>Projects</span>
      </a>
    </li>
  </ul>
</nav>