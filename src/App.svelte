<script>
  import "./app.css";

  let selected = false;
  let finishedLearning = false;

  let surahSelect = 0;
  let ayahFromSelect = 0;
  let ayahToSelect = 0;

  let currentAudioLoaded = false;
  let currentSurah = 0;
  let currentAyah = 0;
  let currentRound = 0;
  let currentAyahAudioPathUrl = "";

  let ayahsLearnt = 0;

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

    getAyahAudio(currentSurah, currentAyah);
  }

  function getSurahImages(surah, ayah) {
    return `http://cdn.islamic.network/quran/images/${surah}_${ayah}.png`;
  }

  function getAyahAudio(surah, ayah) {
    let audioPath = "";

    fetch(`https://api.quran.com/api/v4/recitations/7/by_ayah/${surah}:${ayah}`)
      .then((response) => response.json())
      .then((data) => {
        audioPath = data.audio_files[0].url;
        currentAyahAudioPathUrl = `https://verses.quran.com/${audioPath}`;
        currentAudioLoaded = true;
      });
  }

  function nextAyah() {
    if (currentAyah == ayahToSelect) finished();
    console.log(currentAyah);

    currentRound = 0;
    currentAyah = currentAyah + 1;
    currentAudioLoaded = false; // we do this so the audio can reset
    ayahsLearnt++;

    getAyahAudio(currentSurah, currentAyah);
  }

  function finished() {
    finishedLearning = true;
  }
</script>

<main>
  <header>
    <h1>Quran Learner</h1>
  </header>

  {#if !selected}
    <div class="selectWrapper">
      <div class="selectWrapperTwo">
        <div>
          <label class="start">Surah</label>
          <input class="start" type="number" bind:value={surahSelect} />
        </div>
        <div>
          <label class="start">Ayah from</label>
          <input class="start" type="number" bind:value={ayahFromSelect} />
        </div>
        <div>
          <label class="start">Ayah to</label>
          <input class="start" type="number" bind:value={ayahToSelect} />
        </div>
        <div class="selectWrapper">
          <button class="start" on:click={play}>play</button>
        </div>
      </div>
    </div>
  {/if}
  {#if selected}
    {#if !finishedLearning}
      <div class="playingWrapper">
        {#if currentRound == 0}
          <div>
            {#if currentAudioLoaded}
              <audio loop controls autoplay>
                <source src={currentAyahAudioPathUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            {/if}
          </div>
          <button class="playing" on:click={() => currentRound++}
            >Continue</button
          >
        {/if}
        {#if currentRound == 1}
          <h4>Read with the recitation.</h4>
          <img
            src={getSurahImages(currentSurah, currentAyah)}
            alt="You don't have internet"
          />
          <div>
            {#if currentAudioLoaded}
              <audio loop controls autoplay>
                <source src={currentAyahAudioPathUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            {/if}
          </div>
          <button class="playing" on:click={() => currentRound++}
            >Test Yourself</button
          >
        {/if}
        {#if currentRound == 2}
          <h3>Say it, Without Help</h3>
          <p>can't remember?</p>
          <button class="playing" on:click={() => (currentRound = 0)}
            >Go Back to 0</button
          >
          <div>
            <button
              style="margin-top: 10px;"
              class="playing"
              on:click={nextAyah}>Next Ayah, I know it!</button
            >
          </div>
        {/if}
      </div>
    {/if}
    {#if finishedLearning}
      <div class="finishedWrapper">
        <div class="finishedWrapperTwo">
          <h2>Good Job</h2>
          <h3>Finished Learning</h3>
          <p>Ayahs learnt: {ayahsLearnt}</p>
          <button class="playing" on:click={() => location.reload()}
            >Play Again</button
          >
        </div>
      </div>
    {/if}
  {/if}
</main>
