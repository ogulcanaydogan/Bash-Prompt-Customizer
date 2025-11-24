const shellCommand = document.getElementById('shellCommand');
const copyButton = document.getElementById('copyButton');
const copyHint = document.getElementById('copyHint');
const resetButton = document.getElementById('resetButton');
const shellSelector = document.getElementById('shellSelector');

const controls = [
    {
        key: 'bracket',
        check: document.getElementById('bracketColorCheck'),
        picker: document.getElementById('bracketColorPicker'),
        value: document.getElementById('bracketColorValue'),
        card: document.querySelector('[data-control="bracket"]'),
        preview: [
            document.getElementById('bracketColorPreview'),
            document.getElementById('bracketColorPreviewEnd')
        ]
    },
    {
        key: 'timestamp',
        check: document.getElementById('timestampColorCheck'),
        picker: document.getElementById('timestampColorPicker'),
        value: document.getElementById('timestampColorValue'),
        card: document.querySelector('[data-control="timestamp"]'),
        preview: [document.getElementById('timestampColorPreview')]
    },
    {
        key: 'directory',
        check: document.getElementById('directoryColorCheck'),
        picker: document.getElementById('directoryColorPicker'),
        value: document.getElementById('directoryColorValue'),
        card: document.querySelector('[data-control="directory"]'),
        preview: [document.getElementById('directoryColorPreview')]
    },
    {
        key: 'username',
        check: document.getElementById('usernameColorCheck'),
        picker: document.getElementById('usernameColorPicker'),
        value: document.getElementById('usernameColorValue'),
        card: document.querySelector('[data-control="username"]'),
        preview: [document.getElementById('usernameColorPreview')]
    },
    {
        key: 'hostname',
        check: document.getElementById('hostnameColorCheck'),
        picker: document.getElementById('hostnameColorPicker'),
        value: document.getElementById('hostnameColorValue'),
        card: document.querySelector('[data-control="hostname"]'),
        preview: [document.getElementById('hostnameColorPreview')]
    },
    {
        key: 'promptSymbol',
        check: document.getElementById('promptSymbolColorCheck'),
        picker: document.getElementById('promptSymbolColorPicker'),
        value: document.getElementById('promptSymbolColorValue'),
        card: document.querySelector('[data-control="promptSymbol"]'),
        preview: [document.getElementById('promptSymbolPreview')]
    }
];

const initialState = {
    bracket: { checked: true, value: '#38bdf8' },
    timestamp: { checked: true, value: '#fde047' },
    directory: { checked: true, value: '#a855f7' },
    username: { checked: true, value: '#22d3ee' },
    hostname: { checked: true, value: '#f97316' },
    promptSymbol: { checked: true, value: '#f43f5e' }
};

let copyTimeoutId;

function hexToRgbArray(hex) {
    const value = hex.replace('#', '');
    return [
        parseInt(value.slice(0, 2), 16),
        parseInt(value.slice(2, 4), 16),
        parseInt(value.slice(4, 6), 16)
    ];
}

function colorizeSegment(segment, hex) {
    if (!hex) {
        return segment;
    }

    const rgb = hexToRgbArray(hex);
    return `\\[\\e[38;2;${rgb.join(';')}m\\]${segment}\\[\\e[0m\\]`;
}

function colorizeZshSegment(segment, hex) {
    if (!hex) {
        return segment;
    }

    return `%F{${hex}}${segment}%f`;
}

function colorizePowerShellSegment(segment, hex) {
    if (!hex) {
        return segment;
    }

    const rgb = hexToRgbArray(hex);
    return `$([char]27)[38;2;${rgb.join(';')}m${segment}$([char]27)[0m`;
}

function updateInterface() {
    const colorState = {};

    controls.forEach(control => {
        const isActive = control.check.checked;
        const hex = control.picker.value;

        control.picker.disabled = !isActive;
        control.card.classList.toggle('disabled', !isActive);
        control.value.textContent = hex.toUpperCase();

        const targets = Array.isArray(control.preview) ? control.preview : [control.preview];
        targets.forEach(target => {
            if (!target) return;
            target.style.color = isActive ? hex : target.dataset.defaultColor || '';
        });

        colorState[control.key] = isActive ? hex : null;
    });

    updateShellCommand(colorState);
}

function buildBashCommand(colors) {
    let command = 'export PS1="';

    command += colorizeSegment('[', colors.bracket);
    command += colorizeSegment('\\t', colors.timestamp);
    command += colorizeSegment(']', colors.bracket);
    command += ' ';
    command += colorizeSegment('\\w', colors.directory);
    command += '\\n';
    command += colorizeSegment('\\u', colors.username);
    command += '@';
    command += colorizeSegment('\\h', colors.hostname);
    command += ' ';
    command += colorizeSegment('$', colors.promptSymbol);
    command += ' ';
    command += '\\[\\e[0m\\]"';

    return command;
}

function buildZshCommand(colors) {
    let command = "export PROMPT=$'";

    command += colorizeZshSegment('[', colors.bracket);
    command += colorizeZshSegment('%*', colors.timestamp);
    command += colorizeZshSegment(']', colors.bracket);
    command += ' ';
    command += colorizeZshSegment('%~', colors.directory);
    command += '\\n';
    command += colorizeZshSegment('%n', colors.username);
    command += '@';
    command += colorizeZshSegment('%m', colors.hostname);
    command += ' ';
    command += colorizeZshSegment('$', colors.promptSymbol);
    command += ' ';
    command += '%f%k';
    command += "'";

    return command;
}

function buildPowerShellCommand(colors) {
    const parts = [
        colorizePowerShellSegment('[', colors.bracket),
        colorizePowerShellSegment('$([DateTime]::Now.ToString(\"HH:mm:ss\"))', colors.timestamp),
        colorizePowerShellSegment(']', colors.bracket),
        ' ',
        colorizePowerShellSegment('$(Get-Location)', colors.directory),
        '`n',
        colorizePowerShellSegment('$env:USERNAME', colors.username),
        '@',
        colorizePowerShellSegment('$env:COMPUTERNAME', colors.hostname),
        ' ',
        colorizePowerShellSegment('$', colors.promptSymbol),
        ' ',
        '$([char]27)[0m'
    ].join('');

    return [
        'function prompt {',
        `    "${parts}"`,
        '}'
    ].join('\n');
}

function updateShellCommand(colors) {
    let command;

    switch (shellSelector.value) {
        case 'zsh':
            command = buildZshCommand(colors);
            break;
        case 'powershell':
            command = buildPowerShellCommand(colors);
            break;
        case 'bash':
        default:
            command = buildBashCommand(colors);
            break;
    }

    shellCommand.value = command;
}

async function copyCommand() {
    const text = shellCommand.value;

    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            shellCommand.focus();
            shellCommand.select();
            document.execCommand('copy');
            window.getSelection()?.removeAllRanges();
        }
        showCopyHint('Command copied to clipboard.');
    } catch (error) {
        console.error('Clipboard copy failed', error);
        showCopyHint('Unable to copy. Select the text manually.', true);
    }
}

function showCopyHint(message, isError = false) {
    copyHint.textContent = message;
    copyHint.classList.toggle('copy-hint--error', Boolean(isError));

    clearTimeout(copyTimeoutId);
    copyTimeoutId = setTimeout(() => {
        copyHint.textContent = '';
        copyHint.classList.remove('copy-hint--error');
    }, 2400);
}

function resetControls() {
    Object.entries(initialState).forEach(([key, state]) => {
        const control = controls.find(item => item.key === key);
        if (!control) return;

        control.check.checked = state.checked;
        control.picker.value = state.value;
    });

    updateInterface();
    showCopyHint('Defaults restored.');
}

controls.forEach(control => {
    control.picker.addEventListener('input', updateInterface);
    control.check.addEventListener('change', updateInterface);
});

copyButton.addEventListener('click', copyCommand);
resetButton.addEventListener('click', resetControls);
shellSelector.addEventListener('change', updateInterface);

updateInterface();
