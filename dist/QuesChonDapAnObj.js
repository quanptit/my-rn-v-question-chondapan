import { getStringsCommon } from "my-rn-common-resource";
import { shuffle } from "lodash";
import { BaseQuestion } from "my-rn-base-question";
export class QuesChonDapAnObj extends BaseQuestion {
    initData(obj) {
        this.userAnswers = [false, false, false, false, false];
        if (obj == undefined)
            return;
        this.Q = obj.Q;
        this.audio = obj.audio;
        this.explanation = obj.Explanation;
        this.instruction = obj.instruction;
        this.topInstruction = obj.topInstruction;
        this.widthImg = obj.widthImg;
        this.heightImg = obj.heightImg;
        this.img = obj.ImgUrl;
        let dapDans = [];
        this.stt = obj.stt;
        this.typeQ = obj.typeQ;
        this.isHorizontalChoice = obj.isHorizontalChoice;
        this.type = obj.type;
        if (obj.isTrueFalseQuestion) {
            let A = getStringsCommon().Dung;
            let B = getStringsCommon().Sai;
            if (obj.isTrueAnswer)
                A += "-ok";
            else
                B += "-ok";
            dapDans.push(A);
            dapDans.push(B);
            this.dapDans = shuffle(dapDans);
            return;
        }
        if (obj.A != null)
            dapDans.push(obj.A);
        if (obj.B != null)
            dapDans.push(obj.B);
        if (obj.C != null)
            dapDans.push(obj.C);
        if (obj.D != null)
            dapDans.push(obj.D);
        if (obj.E != null)
            dapDans.push(obj.E);
        this.dapDans = shuffle(dapDans);
    }
    getQuestionUniqueId() {
        let result = 0;
        if (this.Q)
            result += this.Q.hashCode();
        if (this.img)
            result += this.img.hashCode();
        if (this.audio)
            result += this.audio.hashCode();
        for (let item of this.dapDans) {
            result += item.hashCode();
        }
        for (let i = 0; i < this.userAnswers.length; i++) {
            if (this.userAnswers[i])
                result += (i + 1);
        }
        return result;
    }
    clearAnswer() {
        this.userAnswers = [false, false, false, false, false];
    }
    checkIsUserAnswer() {
        for (let i = 0; i <= 4; i++) {
            if (this.userAnswers[i])
                return true;
        }
        return false;
    }
    getNoTotal() {
        return 1;
    }
    checkAnswerScore() {
        let indexAnswer = -1;
        for (let i = 0; i <= 4; i++) {
            if (this.userAnswers[i]) {
                indexAnswer = i;
                break;
            }
        }
        if (indexAnswer >= 0 && this.isCorrectAnswer(indexAnswer)) {
            return { noTotal: 1, noCorrect: 1 };
        }
        return { noTotal: 1, noCorrect: 0 };
    }
    isCorrectAnswer(index) {
        if (this.dapDans == undefined) {
            return false;
        }
        if (this.dapDans.length <= index) {
            return false;
        }
        return this.dapDans[index].includes("-ok");
    }
    clearUserAnswer() {
        this.userAnswers = [false, false, false, false, false];
    }
    getQuestion() {
        let result = "";
        if (this.instruction)
            result = `<fontpink> ${this.instruction.replace("/<br></br>/g", "</br>")} </fontpink></br></br>`;
        if (this.topInstruction)
            result = "<fontpink>" + this.topInstruction.replaceAll("<br></br>", "</br>") + "</fontpink></br></br>";
        if (this.typeQ)
            result += "<p><fontpink>" + getStringsCommon()["typeQ" + this.typeQ] + "</fontpink></p>";
        if (this.Q) {
            result += this.Q;
        }
        if (this.stt)
            result = this.stt + ". " + result;
        return result;
    }
    // explan chỉ có khi user đã answer
    getDapAn(index) {
        if (this.dapDans == undefined) {
            return null;
        }
        if (this.dapDans.length <= index) {
            return null;
        }
        let isCorrectAnswer = false;
        let answerFull = this.dapDans[index];
        if (answerFull.includes("-ok")) {
            answerFull = answerFull.replace("-ok", "").trim();
            isCorrectAnswer = true;
        }
        let listStr = answerFull.split(";;");
        let answerText = this.isHorizontalChoice ? listStr[0] : (preTexts[index] + ". " + listStr[0]);
        if (this.isUserAnswer) {
            let explan = (this.userAnswers[index] && listStr.length >= 2) ? (listStr[1].trim()) : undefined;
            return {
                answerText: answerText, explan: explan, isCorrectAnswer: isCorrectAnswer,
                isUserAnswerThis: this.userAnswers[index]
            };
        }
        else {
            return {
                answerText: answerText.length === 0 ? preTexts[index] : answerText
            };
        }
    }
}
const preTexts = ["(A) ", "(B) ", "(C) ", "(D) ", "(E) "];
