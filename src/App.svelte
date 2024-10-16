<!--
    @source: https://github.com/jacob-willden/svelte-trivia-app/

    @licstart  The following is the entire license notice for this file.

    This file is part of Svelte Trivia App.

    Svelte Trivia App Copyright (C) 2023, 2024 Jacob Willden
    (Released under the GNU General Public License (GNU GPL) Version 3.0 or later)

    Some of the code below is provided by users from StackOverflow, and
	is explicitly stated as so. Such code is released under either the
	Creative Commons Attribution Share-Alike 3.0 or 4.0. I specify Creative
	Commons as my proxy to make the contributions from StackOverflow
	compatible with future versions of the GPL.

    Afformentioned source code derived and modified by Jacob Willden
    Start Date of Derivation/Modification: March 3, 2023
    Most Recent Date of Derivation/Modification: October 15, 2024

    Svelte Trivia App is free software: you can redistribute it and/or
	modify it under the terms of the GNU General Public License (GNU
	GPL) as published by the Free Software Foundation, either version
	3 of the License, or (at your option) any later version. The
	project is distributed WITHOUT ANY WARRANTY; without even the
	implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
	PURPOSE. See the GNU GPL for more details.

    As additional permission under GNU GPL version 3 section 7, you
    may distribute non-source (e.g., minimized or compacted) forms of
    the code without the copy of the GNU GPL normally required by
    section 4, provided you include this license notice and a URL
    through which recipients can access the Corresponding Source.

    You should have recieved a copy of the GNU General Public License
    along with this project. Otherwise, see: https://www.gnu.org/licenses/

    @licend  The above is the entire license notice for this file.
-->

<script>
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

	// Shuffle items in an array, from Laurens Holst, Ben Carp, and Scott on StackOverflow: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	function shuffle(array) {
		for (let i = array.length - 1; i >= 0; i--) {
        	const j = Math.floor(Math.random() * (i + 1));
        	[array[i], array[j]] = [array[j], array[i]];
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

	function answerQuestion(event) {
		const questionText = event.target.parentElement.parentElement.firstChild.textContent;
		const answerText = event.target.value;
		const questionObject = currentQuestions.find(question => question.text === questionText);
		if(answerText === questionObject.correctAnswer) {
			correctCount++;
		}
		else {
			incorrectCount++;
		}

		const buttons = event.target.parentElement.childNodes;
		for(let button of buttons) {
			if(button.value === questionObject.correctAnswer) {
				button.classList.add('is-success');
			}
			else {
				button.classList.add('is-danger');
			}
			button.disabled = true;
			button.style.opacity = '1';
		}
		// console.log(questionObject)
	}

	onMount(async () => {
		fetchTrivia();
	});

	//$: console.log('category:', category, 'difficulty:', difficulty);
</script>

<main>
	<h1 class="title">Svelte Trivia App</h1>

	<p>Questions answered correctly: {correctCount}</p>
	<p>Questions answered incorrectly: {incorrectCount}</p>

	<label for="category-select" class="mt-4">Choose a category:</label>
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

	<fieldset class="mt-4">
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

	<button class="button mt-4" on:click={fetchTrivia}>Get 10 New Questions</button>

		{#each currentQuestions as question}
			<div class="card">
				<div class="card-content">
					<div class="content">
						<p>{question.text}</p>
						<div>
							{#each question.answers as answer}
								<button class="button trivia-answer" value={answer} on:click={answerQuestion}>{answer}</button>
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
		max-width: 60rem;
		margin: 0 auto;
		padding: 1rem;
		font-size: 1.125rem;
	}
	.mt-4 {
		margin-top: 1rem;
	}
	.card {
		margin: 2rem 0;
	}
	.trivia-answer {
		margin-right: 1rem;
		margin-bottom: 1rem;
	}
	.trivia-answer:last-child {
		margin-right: 0;
	}
	.tag {
		margin-top: 1rem;
	}
</style>