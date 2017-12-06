const path = require('path');
const resolve = require('.');

/* Resolve Tests
/* ========================================================================== */

[{
	name: 'will resolve a sass file',
	test: () => resolve('tests/pass-1.sass')
},
{
	name: 'will resolve a sass file without an extension',
	test: () => resolve('tests/pass-1')
},
{
	name: 'will resolve an scss file',
	test: () => resolve('tests/pass-2.scss')
},
{
	name: 'will resolve an scss file without an extension',
	test: () => resolve('tests/pass-2')
},
{
	name: 'will resolve a css file',
	test: () => resolve('tests/pass-3.css')
},
{
	name: 'will resolve a css file without an extension',
	test: () => resolve('tests/pass-3')
},
{
	name: 'will resolve a sass file without an extension from another working directory',
	test: () => resolve('pass-1', {
		cwd: path.join(process.cwd(), 'tests')
	})
},
{
	name: 'will resolve a sass file without its contents',
	test: () => resolve('tests/pass-1').then(
		(result) => !result.contents || Promise.reject('File contents should not have been returned')
	)
},
{
	name: 'will resolve a sass file with its contents',
	test: () => resolve('tests/pass-1', {
		readFile: true
	}).then(
		(result) => result.contents === '.test {\n\torder: 1;\n}\n' || Promise.reject('File contents were unexpected')
	)
},
{
	name: 'will not resolve a non-existent file',
	test: () => resolve('tests/fail-x').then(
		() => Promise.reject(),
		error => error.message === 'File to import not found or unreadable' ? error.message : Promise.reject(error)
	)
},
{
	name: 'will not resolve sass and scss files with the same name without an extension',
	test: () => resolve('tests/fail-1').then(
		() => Promise.reject(),
		error => error.message === 'It\'s not clear which file to import' ? error.message : Promise.reject(error)
	)
},
{
	name: 'will not resolve css and scss files with the same name without an extension',
	test: () => resolve('tests/fail-2').then(
		() => Promise.reject(),
		error => error.message === 'It\'s not clear which file to import' ? error.message : Promise.reject(error)
	)
},
{
	name: 'will not resolve a missing scss file',
	test: () => resolve('tests/fail-3.scss').then(
		() => Promise.reject(),
		error => error.message === 'File to import not found or unreadable' ? error.message : Promise.reject(error)
	)
},
{
	name: 'will not resolve a missing sass file',
	test: () => resolve('tests/fail-3.sass').then(
		() => Promise.reject(),
		error => error.message === 'File to import not found or unreadable' ? error.message : Promise.reject(error)
	)
},
{
	name: 'will not resolve a missing css file, but will still pass',
	test: () => resolve('tests/pass-4.css').then(
		file => file ? Promise.reject() : 'No file returned, without error'
	)
}].reduce(test, Promise.resolve(true)).then(done);

/* Additional tooling
/* ========================================================================== */

function test(promise, entry, index) {
	const name = entry.name;
	const fn = entry.test;
	const isWin32 = process.platform === 'win32';
	const tick    = isWin32 ? '√' : '✔';
	const cross   = isWin32 ? '×' : '✖';

	return promise.then(status => {
		process.stdout.write(`  ─ ${name} `);

		return fn().then(result => {
			process.stdout.write(`${tick}\n`);

			return status;
		}).catch(error => {
			process.stdout.write(`${cross}\n\n${ error }\n\n`);

			return false;
		});
	});
}

function done(status) {
	if (status) {
		process.exit(0);
	} else {
		process.exit(1);
	}
}
