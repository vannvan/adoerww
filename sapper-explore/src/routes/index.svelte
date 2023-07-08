<svelte:head>
  <title>前端月刊</title>
</svelte:head>

<div class="home-container">
  <div class="home-copy">
    <h1>欢迎来到vannvan的前端月刊</h1>
    <p>
      你也可以通过 <a
        href="https://github.com/vannvan/knowledge-garden/tree/master/Iteration/%E6%8A%80%E6%9C%AF%E6%9C%88%E5%88%8A"
        target="_blank">GitHub</a
      > 订阅我的更新.
    </p>
  </div>

  <figure>
    <img alt="Person typing on laptop" src="undraw-illustration.svg" />
    <figcaption>
      Illustration thanks to <a href="https://undraw.co" target="_blank">Undraw</a>
    </figcaption>
  </figure>
</div>

<style>
  .home-container {
    align-items: center;
    display: flex;
    flex: 1;
    justify-content: center;
    margin: 2em 0;
    min-height: 400px;
  }

  .home-copy {
    flex: 1;
  }

  h1 {
    font-weight: 700;
    margin-bottom: 0.5em;
  }

  p {
    font-size: 1.4em;
    line-height: 1.5;
  }

  figure {
    margin: 0 1em;
    text-align: center;
  }

  figcaption {
    font-size: 0.8em;
    font-style: italic;
  }

  img {
    width: 100%;
    max-width: 400px;
  }

  @media (max-width: 1020px) {
    p {
      font-size: 1.2em;
    }

    img {
      max-width: 300px;
    }
  }

  @media (max-width: 800px) {
    .home-container {
      flex-direction: column;
    }

    .home-copy {
      flex: 0;
      padding-bottom: 2em;
      text-align: center;
    }
  }
</style>
