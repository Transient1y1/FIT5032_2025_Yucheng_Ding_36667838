<script setup>
import MyName from './components/MyName.vue'
</script>

<template>
  <div class="application">
    <header class="page-header">
      <p class="task-label">Assessed Lab 1 · Task 1.2</p>

      <h1>Welcome to My Vue Application</h1>

      <p class="introduction">
        This Vue application demonstrates the creation and use of a reusable
        component.
      </p>
    </header>

    <main>
      <MyName />
    </main>

    <footer>
      Created by Yucheng Ding using Vue 3 and Vite
    </footer>
  </div>
</template>

<style scoped>
.application {
  width: min(920px, calc(100% - 40px));
  margin: 0 auto;
  padding: 70px 0 30px;
}

.page-header {
  text-align: center;
}

.task-label {
  display: inline-block;
  margin: 0 0 18px;
  padding: 8px 16px;
  color: #167a54;
  background: #e8f8f0;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #213547;
  font-size: clamp(34px, 6vw, 54px);
  line-height: 1.15;
}

.introduction {
  max-width: 650px;
  margin: 20px auto 0;
  color: #65747e;
  font-size: 18px;
  line-height: 1.7;
}

footer {
  margin-top: 42px;
  color: #849098;
  font-size: 14px;
  text-align: center;
}

@media (max-width: 600px) {
  .application {
    width: min(100% - 24px, 920px);
    padding-top: 40px;
  }

  .introduction {
    font-size: 16px;
  }
}
</style>
