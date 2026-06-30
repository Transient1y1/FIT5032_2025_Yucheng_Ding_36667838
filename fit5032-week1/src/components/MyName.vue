<script setup>
const studentName = 'Yucheng Ding'
const studentId = '36667838'

const githubProfileUrl = 'https://github.com/transient1y1'
const githubRepositoryUrl =
  'https://github.com/Transient1y1/FIT5032_2025_Yucheng_Ding_36667838'
</script>

<template>
  <section class="student-card">
    <div class="component-label">
      MyName.vue Component
    </div>

    <div class="avatar">
      {{ studentName.charAt(0) }}
    </div>

    <h2>
      Hello, my name is
      <span>{{ studentName }}</span>
    </h2>

    <p class="student-id">
      Student ID: {{ studentId }}
    </p>

    <p class="description">
      This content is displayed using the MyName.vue component.
    </p>

    <div class="github-section">
      <h3>GitHub</h3>

      <a
        class="github-link"
        :href="githubProfileUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        View My GitHub Profile
      </a>

      <a
        class="repository-link"
        :href="githubRepositoryUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Project Repository
      </a>
    </div>
  </section>
</template>

<style scoped>
.student-card {
  position: relative;
  width: 100%;
  max-width: 650px;
  margin: 32px auto 0;
  padding: 48px 32px 36px;
  overflow: hidden;
  background: white;
  border: 1px solid #dfe8e4;
  border-radius: 20px;
  box-shadow: 0 18px 50px rgba(33, 53, 71, 0.12);
  text-align: center;
}

.student-card::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 7px;
  background: linear-gradient(90deg, #42b883, #35495e);
  content: '';
}

.component-label {
  display: inline-block;
  margin-bottom: 24px;
  padding: 7px 14px;
  color: #167a54;
  background: #e8f8f0;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.avatar {
  display: flex;
  width: 86px;
  height: 86px;
  margin: 0 auto 22px;
  align-items: center;
  justify-content: center;
  color: white;
  background: linear-gradient(135deg, #42b883, #2c3e50);
  border-radius: 50%;
  box-shadow: 0 10px 24px rgba(66, 184, 131, 0.28);
  font-size: 38px;
  font-weight: 700;
}

h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 28px;
  line-height: 1.35;
}

h2 span {
  color: #42b883;
}

.student-id {
  margin: 14px 0 0;
  color: #52616b;
  font-size: 17px;
  font-weight: 600;
}

.description {
  margin: 18px auto 0;
  max-width: 460px;
  color: #6b7880;
  font-size: 15px;
  line-height: 1.7;
}

.github-section {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid #e2ebe7;
}

.github-section h3 {
  margin: 0 0 16px;
  color: #2c3e50;
  font-size: 18px;
}

.github-link,
.repository-link {
  display: inline-block;
  margin: 6px;
  padding: 11px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.github-link {
  color: white;
  background: #24292f;
}

.repository-link {
  color: #167a54;
  background: #e8f8f0;
  border: 1px solid #bde8d3;
}

.github-link:hover,
.repository-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(33, 53, 71, 0.16);
}
</style>
