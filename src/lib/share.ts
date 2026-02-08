import lz from 'lz-string';
import { Answers } from '../types';
import { DiagnosisResult } from './diagnosis';

const STORAGE_KEY = 'examdiag_results_v1';

export type SavedResult = {
    id: string; // unique ID for deletion
    v: 'v1';
    d: string; // ISO Date
    ans: Answers;
    // Cached summary for display without re-running full logic immediately
    summary: {
        envLabel: string;
        tags: string[];
    };
};

// --- History (localStorage) ---

export function getHistory(): SavedResult[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as SavedResult[];
    } catch (e) {
        console.error("Failed to load history", e);
        return [];
    }
}

export function saveToHistory(answers: Answers, result: DiagnosisResult): void {
    const history = getHistory();

    // Avoid duplicates (simple check by JSON stringify of answers)
    const ansStr = JSON.stringify(answers);
    if (history.some(h => JSON.stringify(h.ans) === ansStr)) {
        return; // Already saved
    }

    const newItem: SavedResult = {
        id: crypto.randomUUID(),
        v: 'v1',
        d: new Date().toISOString(),
        ans: answers,
        summary: {
            envLabel: result.envLabel,
            tags: result.conflictTags.map(t => t.key) // Store keys or labels? Keys are safer for now.
        }
    };

    // Prepend and limit to 10
    const newHistory = [newItem, ...history].slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
}

export function deleteFromHistory(id: string): SavedResult[] {
    const history = getHistory();
    const newHistory = history.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    return newHistory;
}

// --- Share (URL Hash) ---

// Schema for the compressed object
type SharePayload = {
    v: 'v1';
    a: Answers;
};

export function generateShareUrl(answers: Answers): string {
    const payload: SharePayload = { v: 'v1', a: answers };
    const json = JSON.stringify(payload);
    const compressed = lz.compressToEncodedURIComponent(json);
    const url = new URL(window.location.href);
    url.hash = `r=${compressed}`;
    return url.toString();
}

export function parseShareUrl(): Answers | null {
    try {
        const hash = window.location.hash;
        if (!hash.startsWith('#r=')) return null;

        const compressed = hash.slice(3); // remove #r=
        const json = lz.decompressFromEncodedURIComponent(compressed);
        if (!json) return null;

        const payload = JSON.parse(json) as SharePayload;
        if (payload.v !== 'v1') return null;

        return payload.a;
    } catch (e) {
        console.error("Failed to parse share URL", e);
        return null;
    }
}

export async function shareUrl(url: string, title: string = "高校受験診断結果"): Promise<boolean> {
    if (navigator.share) {
        try {
            await navigator.share({
                title: title,
                text: "私の学習タイプ診断結果です！ #高校受験診断",
                url: url
            });
            return true;
        } catch (e) {
            // User cancelled or not supported
            return false;
        }
    } else {
        // Fallback to clipboard
        try {
            await navigator.clipboard.writeText(url);
            return false; // Indicates "Copied" (not native share)
        } catch (e) {
            return false;
        }
    }
}
