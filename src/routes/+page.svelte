<!-- @source: https://github.com/jacob-willden/svelte-trivia-app/
This file is part of Svelte Trivia App, released under the GNU
General Public License (GPL), version 3 or later.

Some of the code below is provided by users from StackOverflow, and
is explicitly stated as so. Such code is released under either the
Creative Commons Attribution Share-Alike (CC BY-SA) 3.0 or 4.0.
I specify Creative Commons as my proxy to make the contributions
from StackOverflow compatible with future versions of the GPL.

Afformentioned source code derived and modified by Jacob Willden
Start Date of Derivation/Modification: March 3, 2023
Most Recent Date of Derivation/Modification: October 15, 2024
-->

{@html `<script>
/*
@licstart  The following is the entire license notice for the
JavaScript code in this page.

Copyright (c) 2023 Jacob Willden

The Universal Permissive License (UPL), Version 1.0

Subject to the condition set forth below, permission is hereby granted to any
person obtaining a copy of this software, associated documentation and/or data
(collectively the "Software"), free of charge and under any and all copyright
rights in the Software, and any and all patent rights owned or freely
licensable by each licensor hereunder covering either (i) the unmodified
Software as contributed to or provided by such licensor, or (ii) the Larger
Works (as defined below), to deal in both

(a) the Software, and
(b) any piece of software and/or hardware listed in the lrgrwrks.txt file if
one is included with the Software (each a "Larger Work" to which the Software
is contributed by such licensors),

without restriction, including without limitation the rights to copy, create
derivative works of, display, perform, and distribute the Software and make,
use, sell, offer for sale, import, export, have made, and have sold the
Software and the Larger Work(s), and to sublicense the foregoing rights on
either these or other terms.

This license is subject to the following condition:
The above copyright notice and either this complete permission notice or at
a minimum a reference to the UPL must be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

@licend  The above is the entire license notice
for the JavaScript code in this page.
*/
</script>`}

<svelte:head>
	<title>Svelte Trivia App</title>
</svelte:head>

<script>
    import { onMount } from 'svelte';

	let correctCount = $state(0);
	let incorrectCount = $state(0);
	let currentQuestions = $state([]);
	let category = $state('');
	let difficulty = $state('');

	// Decode string with HTML entities while avoiding cross-site scripting, from Wladimir Palant on StackOverflow (CC BY-SA 3.0): https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
	function htmlDecode(input) {
		const doc = new DOMParser().parseFromString(input, 'text/html');
		return doc.documentElement.textContent;
	}

	// Shuffle items in an array, from Laurens Holst, Ben Carp, and Scott on StackOverflow (CC BY-SA 3.0, CC BY-SA 3.0, and CC BY-SA 4.0 respectively): https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
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
	}

	onMount(async () => {
		fetchTrivia();
	});
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

	<button class="button mt-4" onclick={fetchTrivia}>Get 10 New Questions</button>

		{#each currentQuestions as question}
			<div class="card">
				<div class="card-content">
					<div class="content">
						<p>{question.text}</p>
						<div>
							{#each question.answers as answer}
								<button class="button trivia-answer" value={answer} onclick={answerQuestion}>{answer}</button>
							{/each}
						</div>
						<span class="tag is-light">Category: {question.category}</span>
					</div>
				</div>
			</div>
		{/each}

	<p>This project uses the <a href="https://opentdb.com/api_config.php">Open Trivia Database Application Programming Interface (API)</a>.</p>
	<a href="/javascript" rel="jslicense">JavaScript Licenses</a>
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