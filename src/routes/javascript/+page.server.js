import {dev} from '$app/environment';
// import {readdirSync} from 'fs';
import { opendir } from 'node:fs/promises';
// import * as path from 'path';

// const parentPath = path.join("./.svelte-kit/output/client/_app/immutable");

async function getFilePathsFromFolder(folder) {
	let filePaths = [];
	const filesPath = await opendir(`/_app/immutable/${folder}`);
	for await (const file of filesPath) {
		filePaths.push(`/_app/immutable/${folder}/${file.name}`);
	}
	// console.log(filePaths)
	return filePaths;
}

export const load = async () => {
	if(dev) {
		return {files: []}; // Need to figure out the directories for development
	}
	else {
		let fileNames = [];
		const folders = ['chunks', 'entry', 'nodes'];
		for(let folder of folders) {
			fileNames.push(await getFilePathsFromFolder(folder));
		}
		// console.log('fileNames', fileNames)
		const flattenedFileNames = fileNames.flat();
		let files = [];
		for(let fileName of flattenedFileNames) {
			const isFromSvelteKit = !fileName.startsWith('/_app/immutable/nodes/2.');
			if(isFromSvelteKit) {
				files.push({
					name: fileName,
					licenseURL: 'https://www.jclark.com/xml/copying.txt',
					licenseName: 'Expat',
					sourceURL: 'https://github.com/sveltejs/kit',
					sourceName: 'SvelteKit'
				});
			}
			else {
				files.push({
					name: fileName,
					licenseURL: 'https://www.gnu.org/licenses/gpl-3.0.html',
					licenseName: 'GNU-GPL-3.0-or-later',
					sourceURL: 'https://github.com/jacob-willden/svelte-trivia-app/blob/main/src/routes/%2Bpage.svelte',
					sourceName: 'src/routes/+page.svelte'
				});
			}
		}
		console.log({files})
		return {files};
	}
}