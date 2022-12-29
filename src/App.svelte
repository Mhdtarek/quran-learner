<script>
  import { surah, ayahFrom, ayahTo } from "./lib/stores.svelte";
  let selected = false;
  let finishedLearning = false;

  let surahSelect = 0;
  let ayahFromSelect = 0;
  let ayahToSelect = 0;

  let currentAudioLoaded = false;
  let currentSurah = 0;
  let currentAyah = 0;
  let currentAyahNumber = 0;
  let currentAyahText = "";
  let currentRound = 0;

  function play() {
    // @ts-ignore
    if (surahSelect == false) return;
    // @ts-ignore
    if (ayahFromSelect == false) return;
    // @ts-ignore
    if (ayahToSelect == false) return;
    // @ts-ignore
    if (ayahFromSelect > ayahToSelect) return;
    selected = true;
    currentAyah = ayahFromSelect;
    currentSurah = surahSelect;

    getAyah(currentSurah, currentAyah);
  }

  async function getAyah(surah, ayah) {
    fetch(`http://api.alquran.cloud/v1/ayah/${surah}:${ayah}/en.asad`)
      .then((response) => response.json())
      .then((data) => {
        currentAyahNumber = data.data.number;
        currentAyahText = data.data.text;
        currentAudioLoaded = true;
      });
  }

  function getSurahImages(surah, ayah) {
    return `http://cdn.islamic.network/quran/images/${surah}_${ayah}.png`;
  }

  function nextAyah() {
    if (currentAyah - 1 == ayahToSelect) finished();
    console.log(currentAyah);

    currentRound = 0;
    currentAyah = currentAyah + 1;
    currentAudioLoaded = false; // we do this so the audio can reset

    getAyah(currentSurah, currentAyah);
  }

  function finished() {
    finishedLearning = true;
  }
</script>

<main>
  {#if !selected}
    <div>
      <label>Surah</label>
      <input type="number" bind:value={surahSelect} />
    </div>
    <div>
      <label>Ayah from</label>
      <input type="number" bind:value={ayahFromSelect} />
    </div>
    <div>
      <label>Ayah to</label>
      <input type="number" bind:value={ayahToSelect} />
    </div>
    <button on:click={play}>play</button>
  {/if}
  {#if selected}
    {#if !finishedLearning}
      {#if currentRound == 0}
        <div>
          {#if currentAudioLoaded}
            <audio loop controls autoplay>
              <source
                src={`https://cdn.islamic.network/quran/audio/64/ar.alafasy/${currentAyahNumber}.mp3`}
                type="audio/mpeg"
              />
              Your browser does not support the audio element.
            </audio>
          {/if}
        </div>
        <button on:click={() => currentRound++}>Next</button>
      {/if}
      {#if currentRound == 1}
        <h4>SAY IT 2X</h4>
        <img
          src={getSurahImages(currentSurah, currentAyah)}
          alt="You don't have internet"
        />
        <p>{currentAyahText}</p>
        <button on:click={() => currentRound++}>Test Yourself</button>
      {/if}
      {#if currentRound == 2}
        <h3>Say it, Without Help</h3>
        <p>can't remember?</p>
        <button on:click={() => (currentRound = 0)}>Go Back to 0</button>
        <div>
          <button on:click={nextAyah}>NEXT, I know it!</button>
        </div>
      {/if}
    {/if}
    {#if finishedLearning}
      <h2>Finished Learning</h2>
      <button on:click={() => location.reload()}>Play Again</button>
    {/if}
  {/if}
</main>
