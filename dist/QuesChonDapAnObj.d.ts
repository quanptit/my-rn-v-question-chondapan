import { BaseQuestion } from "my-rn-base-question";
export declare class QuesChonDapAnObj extends BaseQuestion {
    Q: string;
    topInstruction: string;
    explanation: string;
    img: string;
    indexCorrect: number;
    dapDans: string[];
    audio: string;
    instruction: any;
    widthImg: number;
    heightImg: number;
    stt: number;
    isHorizontalChoice: boolean;
    type: string;
    /**
     * 1: => Choose the right answer based on the picture
     * 2: => Choose the word with the opposite meaning to the underlined word
     * 3: => Choose the word with the same meaning as the underlined word
     * 4: => Choose the underlined part, which is incorrect
     * 5: => Choose the right word to go in the brackets
     * 6: => Choose a substitute for the underlined section
     * 7: => Read the article and answer the question
     * 8: => Fill the correct
     */
    typeQ: number;
    userAnswers: boolean[];
    initData(obj?: any): void;
    getQuestionUniqueId(): number;
    protected clearAnswer(): void;
    protected checkIsUserAnswer(): boolean;
    getNoTotal(): number;
    protected checkAnswerScore(): {
        noTotal: number;
        noCorrect: number;
    };
    isCorrectAnswer(index: any): boolean;
    clearUserAnswer(): void;
    getQuestion(): string;
    getDapAn(index: number): {
        isCorrectAnswer?: boolean;
        isUserAnswerThis?: boolean;
        answerText?: string;
        explan?: string;
    };
}
