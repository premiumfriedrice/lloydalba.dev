<script>
  import "../app.css";
  import { inject } from '@vercel/analytics'
  import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

  inject(); 
  injectSpeedInsights();
</script>
  
<slot />
<!-- 
header
hero
product description
user reviews
faq
conversion
footer 
-->
