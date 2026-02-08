export interface Question {
    id: string;
    text: string;
    factor: string;
    reverse: boolean;
}

export type Screen = 'start' | 'question' | 'result' | 'history';

export interface Answers {
    [key: string]: number;
}
