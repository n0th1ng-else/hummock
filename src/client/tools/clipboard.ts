export function copyToClipboard(text: string): void {
	try {
		const clipboardElement = document.createElement('textarea');
		clipboardElement.value = text;
		clipboardElement.setAttribute('readonly', '');
		clipboardElement.style.position = 'absolute';
		clipboardElement.style.left = '-9999px';
		clipboardElement.style.display = 'none;';
		document.body.appendChild(clipboardElement);
		clipboardElement.select();
		document.execCommand('copy');
		document.body.removeChild(clipboardElement);
	} catch (err) {
		console.error('Unable to use clipboard!', err);
	}
}
