import { readdirSync } from 'fs';
import { building } from '$app/environment';

export function load() {
	const partialParentPath = readdirSync('./.svelte-kit/output');
	if(partialParentPath.includes('client')) {
		const parentPath = './.svelte-kit/output/client/_app/immutable';
		let files = [];
		const fileNames = readdirSync(parentPath, {recursive: true});
		for(let fileName of fileNames) {
			if(fileName.endsWith('.js')) {
				const isFromSvelteKit = !fileName.startsWith('nodes/');
				if(isFromSvelteKit) {
					files.push({
						name: `${building ? '/_app/immutable' : parentPath}/${fileName}`,
						licenseURL: 'http://www.jclark.com/xml/copying.txt',
						licenseName: 'Expat',
						sourceURL: 'https://github.com/sveltejs/kit',
						sourceName: 'SvelteKit'
					});
				}
				else {
					files.push({
						name: `${building ? '/_app/immutable' : parentPath}/${fileName}`,
						licenseURL: 'http://www.gnu.org/licenses/gpl-3.0.html',
						licenseName: 'GNU-GPL-3.0-or-later',
						sourceURL: 'https://github.com/jacob-willden/svelte-trivia-app/blob/main/src/routes/%2Bpage.svelte',
						sourceName: 'src/routes/+page.svelte'
					});
				}
			}
		}
		return {files};
	}
}