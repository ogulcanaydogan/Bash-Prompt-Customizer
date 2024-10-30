// Additi// Get elements for each part of the preview
const previewPrompt = document.getElementById('previewPrompt');
const timestampColorPreview = document.getElementById('timestampColorPreview');
const directoryColorPreview = document.getElementById('directoryColorPreview');
const usernameColorPreview = document.getElementById('usernameColorPreview');
const hostnameColorPreview = document.getElementById('hostnameColorPreview');
const promptSymbolPreview = document.getElementById('promptSymbolPreview');
const bracketColorPreview = document.getElementById('bracketColorPreview');
const bracketColorPreviewEnd = document.getElementById('bracketColorPreviewEnd');

// Update Bash command and live preview
function updateBashCommand() {
    const components = {
        bgColor: bgColorCheck.checked ? hexToRgb(bgColorPicker.value) : null,
        textColor: textColorCheck.checked ? hexToRgb(textColorPicker.value) : null,
        cursorColor: cursorColorCheck.checked ? hexToRgb(cursorColorPicker.value) : null,
        bracketColor: bracketColorCheck.checked ? hexToRgb(bracketColorPicker.value) : null,
        timestampColor: timestampColorCheck.checked ? hexToRgb(timestampColorPicker.value) : null,
        directoryColor: directoryColorCheck.checked ? hexToRgb(directoryColorPicker.value) : null,
        usernameColor: usernameColorCheck.checked ? hexToRgb(usernameColorPicker.value) : null,
        hostnameColor: hostnameColorCheck.checked ? hexToRgb(hostnameColorPicker.value) : null,
        promptSymbolColor: promptSymbolColorCheck.checked ? hexToRgb(promptSymbolColorPicker.value) : null,
    };

    let command = 'export PS1="';
    if (components.bgColor) command += `\\[\\e[48;2;${components.bgColor.join(';')}m\\]`;
    if (components.textColor) command += `\\[\\e[38;2;${components.textColor.join(';')}m\\]`;
    if (components.bracketColor) command += `\\[\\e[38;2;${components.bracketColor.join(';')}m\\][`;
    if (components.timestampColor) command += `\\[\\e[38;2;${components.timestampColor.join(';')}m\\]\\t`;
    if (components.directoryColor) command += `\\[\\e[38;2;${components.directoryColor.join(';')}m\\]\\w`;
    if (components.bracketColor) command += `\\[\\e[38;2;${components.bracketColor.join(';')}m\\]]`;
    command += '\\r\\n';
    if (components.usernameColor) command += `\\[\\e[38;2;${components.usernameColor.join(';')}m\\]\\u`;
    if (components.hostnameColor) command += `\\[\\e[38;2;${components.hostnameColor.join(';')}m\\]@\\h`;
    if (components.promptSymbolColor) command += `\\[\\e[38;2;${components.promptSymbolColor.join(';')}m\\]$`;
    command += '\\[$(tput sgr0)\\]"';

    bashCommand.value = command;

    // Update the live preview display with each color component
    if (components.timestampColor) timestampColorPreview.style.color = `rgb(${components.timestampColor.join(',')})`;
    if (components.directoryColor) directoryColorPreview.style.color = `rgb(${components.directoryColor.join(',')})`;
    if (components.usernameColor) usernameColorPreview.style.color = `rgb(${components.usernameColor.join(',')})`;
    if (components.hostnameColor) hostnameColorPreview.style.color = `rgb(${components.hostnameColor.join(',')})`;
    if (components.promptSymbolColor) promptSymbolPreview.style.color = `rgb(${components.promptSymbolColor.join(',')})`;
    if (components.bracketColor) {
        bracketColorPreview.style.color = `rgb(${components.bracketColor.join(',')})`;
        bracketColorPreviewEnd.style.color = `rgb(${components.bracketColor.join(',')})`;
    }
}

// Copy to clipboard function
function copyToClipboard() {
    bashCommand.select();
    document.execCommand('copy');
    alert('Bash command copied to clipboard!');
}

// Event listeners for each color picker and checkbox
const colorPickers = [
    { picker: bgColorPicker, display: bgColorDisplay, check: bgColorCheck },
    { picker: textColorPicker, display: textColorDisplay, check: textColorCheck },
    { picker: cursorColorPicker, display: cursorColorDisplay, check: cursorColorCheck },
    { picker: bracketColorPicker, display: bracketColorDisplay, check: bracketColorCheck },
    { picker: timestampColorPicker, display: timestampColorDisplay, check: timestampColorCheck },
    { picker: directoryColorPicker, display: directoryColorDisplay, check: directoryColorCheck },
    { picker: usernameColorPicker, display: usernameColorDisplay, check: usernameColorCheck },
    { picker: hostnameColorPicker, display: hostnameColorDisplay, check: hostnameColorCheck },
    { picker: promptSymbolColorPicker, display: promptSymbolColorDisplay, check: promptSymbolColorCheck },
];

colorPickers.forEach(({ picker, display, check }) => {
    picker.addEventListener('input', () => {
        updateDisplay(picker, display);
        updateBashCommand();
    });
    check.addEventListener('change', updateBashCommand);
});

copyButton.addEventListener('click', copyToClipboard);
updateBashCommand();
