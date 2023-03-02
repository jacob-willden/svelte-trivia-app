<script>
	import 'bulma/css/bulma.min.css'; // From Carlos Roso: https://carlosroso.com/how-to-import-css-files-to-svelte/
    import { onMount } from 'svelte';

	let correctCount = 0;
	let incorrectCount = 0;
	let currentQuestions = [];

	async function fetchData(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        }
        catch(error) {
            console.error(error);
        }
    }

	onMount(async () => {
		const currentQuestionsData = await fetchData('https://opentdb.com/api.php?amount=10');
		currentQuestions = currentQuestionsData.results;
	});
</script>

<main>
	<h1 class="title">Svelte Trivia App</h1>

	<p>Questions answered correctly: {correctCount}</p>
	<p>Questions answered incorrectly: {incorrectCount}</p>

	<label for="category-select">Choose a category:</label>
	<div class="select">
		<select name="category-select" class="select">
			<option value="any">Any Category</option>
			<option value="9">General Knowledge</option>
			<option value="10">Entertainment: Books</option>
			<option value="11">Entertainment: Film</option>
			<option value="12">Entertainment: Music</option>
			<option value="13">Entertainment: Musicals &amp; Theatres</option>
			<option value="14">Entertainment: Television</option>
			<option value="15">Entertainment: Video Games</option>
			<option value="16">Entertainment: Board Games</option>
			<option value="17">Science &amp; Nature</option>
			<option value="18">Science: Computers</option>
			<option value="19">Science: Mathematics</option>
			<option value="20">Mythology</option>
			<option value="21">Sports</option>
			<option value="22">Geography</option>
			<option value="23">History</option>
			<option value="24">Politics</option>
			<option value="25">Art</option>
			<option value="26">Celebrities</option>
			<option value="27">Animals</option>
			<option value="28">Vehicles</option>
			<option value="29">Entertainment: Comics</option>
			<option value="30">Science: Gadgets</option>
			<option value="31">Entertainment: Japanese Anime &amp; Manga</option>
			<option value="32">Entertainment: Cartoon &amp; Animations</option>
		</select>
	</div>

	<fieldset>
		<legend>Choose a difficulty level:</legend>
		<div class="control">
			<label class="radio">
				<input type="radio" name="difficulty" value="easy">
				Easy
			</label>
			<label class="radio">
				<input type="radio" name="difficulty" value="medium">
				Medium
			</label>
			<label class="radio">
				<input type="radio" name="difficulty" value="hard">
				Hard
			</label>
		</div>
	</fieldset>

	<button class="button">Get 10 New Questions</button>

	<ul>
		{#each currentQuestions as question, index}
		<li>{question.question}</li>
		{/each}
	</ul>

	<p>Created using the <a href="https://opentdb.com/api_config.php">Open Trivia Database API</a>.</p>
</main>

<style>
	main {
		padding: 1rem;
	}
</style>