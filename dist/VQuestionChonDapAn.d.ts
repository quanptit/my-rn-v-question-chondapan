/// <reference types="react" />
import { ImageRequireSource, StyleProp, ViewStyle, ImageSourcePropType } from 'react-native';
import { ImvPlayAudio } from "my-rn-sound";
import { IPathUtilsModule } from "my-rn-base-utils";
import { QuesChonDapAnObj } from "./QuesChonDapAnObj";
import { VBaseQuestion, BaseQuestion } from "my-rn-base-question";
interface Props {
    question: QuesChonDapAnObj;
    PathUtils: IPathUtilsModule;
    style?: StyleProp<ViewStyle>;
    checkboxIcon?: {
        correct: ImageRequireSource;
        fail: ImageRequireSource;
    };
}
export declare class VQuestionChonDapAn extends VBaseQuestion<Props> {
    static defaultProps: {
        checkboxIcon: {
            correct: any;
            fail: any;
        };
    };
    imvPlayAudio: ImvPlayAudio;
    shouldComponentUpdate(nextProps: Props, nextState: any): boolean;
    onClickRadio(index: any, question: QuesChonDapAnObj): void;
    onRender(): JSX.Element;
    renderDapAn(index: any, question: QuesChonDapAnObj): JSX.Element;
    private static _renderRightTextCb;
    static renderExplantion(question: QuesChonDapAnObj): any;
    renderQuestion(question: QuesChonDapAnObj): JSX.Element;
    _renderQuestionTextAndAudio(question: QuesChonDapAnObj): JSX.Element;
    private static _renderQuestionText;
    private static _renderImage;
    getQuesObj(): BaseQuestion;
}
export declare function renderCheckBoxIcon(isAnswered: any, isCorrectAnswer: any, sourceImgCorrect: ImageSourcePropType, sourceImgFail: ImageSourcePropType): any;
export {};
