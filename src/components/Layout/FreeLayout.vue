<script setup lang="ts"></script>

<template>
  <!-- <div>
    <div class="onopen_mask">
      <div class="onopen_title">
        <img src="@/assets/logos/light_logo.svg" alt="">
        <p>
          FreeBe temporarily not opened <br>
          is rushing to online~~
        </p>
      </div>
    </div>
    <FreeTopNav />
    <RouterView />
    <FreeFooter />
  </div> -->

  <div class="noopen_box">
    <div class="noopen_content">
      <div class="header_title">
        FreeBe is still under prototyping…
      </div>
      <div class="body_content">
        FreeBe is not offically launched and currently we are still prototyping and fixing bugs.
        <br>
        <br>
        <a href="https://discord.com/invite/VSG8vNTtAt">Join our discord</a> or click the button below to help
        accelerate
        the development process.
      </div>
      <div class="footer">
        <a href="https://www.yuque.com/forms/share/7c6ee62c-42b6-4607-8759-ab8ce8037122">
          <FreeBtn style="width: 240px;"> Apply for early access </FreeBtn>
        </a>
      </div>
    </div>
  </div>
</template>


<!-- <template>
 FreeTopNav: 原生自定义 | FreeHeader: Headless UI 

  <FreeTopNav />
  <FreeHeader />
  <RouterView />
  <FreeFooter />

</template> -->
