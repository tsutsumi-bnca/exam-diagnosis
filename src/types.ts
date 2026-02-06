export interface Question {
    id: string;
    text: string;
    factor: string;
    reverse: boolean;
}

export type Screen = 'start' | 'question' | 'result';

export interface Answers {
    [key: string]: number;
}
