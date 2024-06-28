
document.addEventListener("DOMContentLoaded", function() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const hangulTableContainer = document.getElementById('hangul-table');

    fullscreenBtn.addEventListener('click', function() {
        if (!document.fullscreenElement) {
            hangulTableContainer.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    });
});




// Fetch and process data
async function fetchData() {
    try {
        const response = await fetch('./theme/assets/hangul_data.json');
        const data = await response.json();
        return createAudioMap(data);
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

function createAudioMap(data) {
    const audioMap = {};
    data.data.forEach(item => {
        audioMap[item.consonant + item.vowel] = {
            combined: item.combined,
            nepali_combined: item.nepali_combined,
            url: item.url,
            local: item.local
        };
    });
    return audioMap;
}

// UI interactions
function clearHighlights() {
    document.querySelectorAll('.highlight').forEach(cell => {
        cell.classList.remove('highlight');
    });
}

function highlightCells(consonant, vowel) {
    document.querySelector(`[data-consonant="${consonant}"]`).classList.add('highlight');
    document.querySelector(`[data-vowel="${vowel}"]`).classList.add('highlight');
}

function updateCellContent(cell, audioInfo) {
    cell.innerHTML = `${audioInfo.combined}<br>${audioInfo.nepali_combined}`;
}

async function playAudio(audioInfo) {
    try {
        const audio = new Audio(audioInfo.url);
        await audio.play();
    } catch {
        const fallbackAudio = new Audio(audioInfo.local);
        console.log("Local Audio...")
        await fallbackAudio.play();
    }
}

// Main function
async function initializeApp() {
    const audioMap = await fetchData();

    document.querySelectorAll('td').forEach(cell => {
        cell.addEventListener('click', async () => {
            clearHighlights();

            const consonant = cell.getAttribute('data-consonant');
            const vowel = cell.getAttribute('data-vowel');
            const audioInfo = audioMap[consonant + vowel];
            if (audioInfo) {
                await playAudio(audioInfo);
                highlightCells(consonant, vowel);
                updateCellContent(cell, audioInfo);
            } else {
                console.log(consonant);
                alert('Audio not available for this combination.');
            }
        });
    });
}

// Initialize the app
initializeApp();