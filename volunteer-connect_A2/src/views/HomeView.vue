<template>
  <div class="home-view">
    <section class="home-intro border-bottom">
      <div class="container-xxl py-5 py-lg-6">
        <div class="row align-items-end g-4">
          <div class="col-lg-8">
            <p class="eyebrow mb-3">Student volunteering, made practical</p>
            <h1 class="display-4 fw-bold mb-3">Find a role that fits your week.</h1>
            <p class="lead text-secondary mb-4 intro-copy">
              Explore local opportunities with the time, location and support details you need before you apply.
            </p>
            <div class="d-flex flex-wrap gap-2">
              <RouterLink class="btn btn-primary btn-lg" to="/opportunities">
                Browse opportunities
              </RouterLink>
              <RouterLink class="btn btn-light btn-lg" to="/how-it-works">See how it works</RouterLink>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="intro-signal p-4" aria-label="VolunteerConnect focus">
              <p class="small text-uppercase fw-semibold mb-2">VolunteerConnect focus</p>
              <p class="h5 mb-2">Clear roles. Confident applications. Stronger local connections.</p>
              <p class="mb-0 text-secondary">Designed around the practical questions students ask before committing.</p>
              <div class="focus-list d-flex flex-wrap gap-2 mt-4" aria-hidden="true">
                <span>Time</span>
                <span>Place</span>
                <span>Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container-xxl py-5" aria-labelledby="audience-heading">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
        <div>
          <p class="eyebrow mb-2">One shared community space</p>
          <h2 id="audience-heading" class="h3 mb-0">Useful from the first search to the final update.</h2>
        </div>
        <span class="section-rule" aria-hidden="true"></span>
      </div>

      <div class="row g-4">
        <article class="col-md-6">
          <div class="audience-panel h-100 p-4">
            <span class="panel-index" aria-hidden="true">01</span>
            <h3 class="h5 mt-3">For students</h3>
            <p class="text-secondary mb-0">Find beginner-friendly roles, understand what to expect and keep your applications in one place.</p>
          </div>
        </article>
        <article class="col-md-6">
          <div class="audience-panel h-100 p-4">
            <span class="panel-index" aria-hidden="true">02</span>
            <h3 class="h5 mt-3">For organisations</h3>
            <p class="text-secondary mb-0">Share structured opportunities and spend less time repeating practical details to applicants.</p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
