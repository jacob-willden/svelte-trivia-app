<script>
	import 'bulma/css/bulma.min.css'; // From Carlos Roso: https://carlosroso.com/how-to-import-css-files-to-svelte/
    import { onMount } from 'svelte';

	let correctCount = 0;
	let incorrectCount = 0;
	let currentQuestions = [];
	let category = '';
	let difficulty = '';

	// Decode string with HTML entities while avoiding cross-site scripting, from Wladimir Palant on StackOverflow: https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
	function htmlDecode(input) {
		const doc = new DOMParser().parseFromString(input, 'text/html');
		return doc.documentElement.textContent;
	}

	// Shuffle items in an array, from StackOverflow: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	function shuffle(array) {
		let currentIndex = array.length, randomIndex;

		// While there remain elements to shuffle
		while (currentIndex != 0) {
			// Pick a remaining element
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element
			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}
		return array;
	}

	async function fetchTrivia() {
        try {
            const response = await fetch(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}`);
            const data = await response.json();
		
			currentQuestions = [];
			for(let questionObject of data.results) {
				const questionText = htmlDecode(questionObject.question);
				const questionType = questionObject.type;
				const questionCategory = questionObject.category;
				const answersArray = shuffle([questionObject.correct_answer, ...questionObject.incorrect_answers]);

				currentQuestions = [
					...currentQuestions, 
					{
						text: questionText,
						type: questionType,
						category: questionCategory,
						answers: answersArray,
						correctAnswer: questionObject.correct_answer
					}
				];
			}
        }
        catch(error) {
            console.error(error);
        }
    }

	onMount(async () => {
		fetchTrivia();
	});

	$: console.log('category:', category, 'difficulty:', difficulty);
</script>

<main>
	<h1 class="title">Svelte Trivia App</h1>

	<p>Questions answered correctly: {correctCount}</p>
	<p>Questions answered incorrectly: {incorrectCount}</p>

	<label for="category-select">Choose a category:</label>
	<div class="select">
		<select name="category-select" class="select" bind:value={category}>
			<option value="">Any Category</option>
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
				<input type="radio" name="difficulty" value="" bind:group={difficulty}>
				Any
			</label>
			<label class="radio">
				<input type="radio" name="difficulty" value="easy" bind:group={difficulty}>
				Easy
			</label>
			<label class="radio">
				<input type="radio" name="difficulty" value="medium" bind:group={difficulty}>
				Medium
			</label>
			<label class="radio">
				<input type="radio" name="difficulty" value="hard" bind:group={difficulty}>
				Hard
			</label>
		</div>
	</fieldset>

	<button class="button" on:click={fetchTrivia}>Get 10 New Questions</button>

		{#each currentQuestions as question}
			<div class="card">
				<div class="card-content">
					<div class="content">
						<p>{question.text}</p>
						<div>
							{#each question.answers as answer}
								<button class="button trivia-answer" value={answer}>{answer}</button>
							{/each}
						</div>
						<span class="tag is-light">Category: {question.category}</span>
					</div>
				</div>
			</div>
		{/each}

	<p>Created using the <a href="https://opentdb.com/api_config.php">Open Trivia Database API</a>.</p>
</main>

<style>
	main {
		padding: 1rem;
	}
	.card {
		margin: 1rem 0;
	}
	.trivia-answer {
		margin: 0 1rem;
	}
	.trivia-answer:first-child, .trivia-answer:last-child {
		margin: 0;
	}
	.tag {
		margin-top: 1rem;
	}
</style>