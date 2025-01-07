import {dev} from '$app/environment';
import {readdirSync} from 'fs';

const parentPath = '_app/immutable';

function getFilePathsFromFolder(path) {
	let filePaths = [];
	const fileNames = readdirSync(`./.svelte-kit/output/client/${path}`);
	for(let file of fileNames) {
		filePaths.push(`${path}/${file}`);
	}
	return filePaths;
}

export const load = () => {
	if(dev) {
		return {files: []}; // Need to figure out the directories for development
	}
	else {
		let fileNames = [];
		const folders = ['chunks', 'entry', 'nodes'];
		for(let folder of folders) {
			fileNames.push(getFilePathsFromFolder(`${parentPath}/${folder}`));
		}
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
		return {files};
	}
}