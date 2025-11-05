const copyToClipBoard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
}

export default copyToClipBoard;