import React, {ReactChild} from 'react'
import RNFetchBlob from 'rn-fetch-blob';
import {Image, ImageRequireSource, StyleProp, View, StyleSheet, ViewStyle, WebView, ImageSourcePropType} from 'react-native'
import {CheckBox, Col, StyleUtils, TextCustom, Touchable, HTMLView} from "my-rn-base-component";
import {ImvPlayAudio} from "my-rn-sound";
import {WebViewCustom} from "my-rn-webview";
import {CommonUtils, IPathUtilsModule, isEmpty} from "my-rn-base-utils";
import {CacheImageClickAble} from "my-rn-clickable-zoom-image";
import {QuesChonDapAnObj} from "./QuesChonDapAnObj";
import {VBaseQuestion, BaseQuestion} from "my-rn-base-question";

const s = StyleUtils.getAllStyle();

interface Props {
    question: QuesChonDapAnObj
    PathUtils: IPathUtilsModule
    style?: StyleProp<ViewStyle>
    checkboxIcon?: { correct: ImageRequireSource, fail: ImageRequireSource }
}

export class VQuestionChonDapAn extends VBaseQuestion<Props> {
    //region default props & field
    static defaultProps = {
        checkboxIcon: {
            correct: require('../assets/ic_ok.png'),
            fail: require('../assets/ic_fail.png')
        }
    };
    imvPlayAudio: ImvPlayAudio;

    //endregion

    shouldComponentUpdate(nextProps: Props, nextState) {
        return nextProps.question.uniqueId !== this.questionUniqueId;
    }

    onClickRadio(index, question: QuesChonDapAnObj) {
        if (question.isUserAnswer) {
            if (question.userAnswers[index] || question.isCorrectAnswer(index)) {
                return
            } else {
                question.userAnswers[index] = true
            }
        } else {
            if (question.userAnswers[index]) {
                question.userAnswers[index] = false
            } else {
                question.clearUserAnswer();
                question.userAnswers[index] = !question.userAnswers[index]
            }
        }
        this.forceUpdate()
    }

    //region Render =======
    onRender() {
        let question: QuesChonDapAnObj = this.props.question;
        return (
            <View style={this.props.style}>
                {this.renderQuestion(question)}
                {this.renderDapAn(0, question)}
                {this.renderDapAn(1, question)}
                {this.renderDapAn(2, question)}
                {this.renderDapAn(3, question)}
                {this.renderDapAn(4, question)}
                {VQuestionChonDapAn.renderExplantion(question)}
            </View>
        )
    }

    renderDapAn(index, question: QuesChonDapAnObj) {
        if (question.dapDans[index] == null)
            return null;
        return (<CheckBox
            ref={'cb' + index}
            radio
            checkedImage={renderCheckBoxIcon(question.isUserAnswer && question.userAnswers[index],
                question.isCorrectAnswer(index), this.props.checkboxIcon.correct, this.props.checkboxIcon.fail)}
            isChecked={question.userAnswers[index]}
            rightTextView={VQuestionChonDapAn._renderRightTextCb(question, index)}
            // rightTextView={<View style={styles.rightTextCb}><HTMLView value={`<b>${question.getDapAn(index)}</b>`}/></View>}
            style={styles.checkBox}
            onClick={this.onClickRadio.bind(this, index, question)}/>)
    }

    private static _renderRightTextCb(question: QuesChonDapAnObj, index): ReactChild {
        let dapAn = question.getDapAn(index);
        // let stylesText = [s.f_nor];
        // if (dapAn.isCorrectAnswer)
        //     stylesText.push(styles.tvCorrect);
        // else if (dapAn.isUserAnswerThis)
        //     stylesText.push(styles.tvInCorrect);
        let html = "<span>" + dapAn.answerText + "</span>";
        if (dapAn.isCorrectAnswer)
            html = "<fontblue>" + html + "</fontblue>";
        else if (dapAn.isUserAnswerThis)
            html = "<fontred>" + html + "</fontred>";

        return (
            <View style={styles.rightTextCb}>
                {/*<TextCustom value={dapAn.answerText} style={stylesText}/>*/}
                <HTMLView value={html}/>
                {dapAn.explan && <TextCustom value={dapAn.explan} style={[s.f_smal_i, styles.tvExplan]}/>}
            </View>
        );
    }

    static renderExplantion(question: QuesChonDapAnObj): any {
        if (!isEmpty(question.explanation) && question.isUserAnswer)
            return (
                <View
                    style={styles.explanContainer}>
                    <HTMLView value={question.explanation}/>
                </View>
            )
    }

    renderQuestion(question: QuesChonDapAnObj) {
        let img = this.props.PathUtils.getPathOnline(question.img);
        if (isEmpty(img)) return this._renderQuestionTextAndAudio(question);
        return (
            <Col>
                {this._renderQuestionTextAndAudio(question)}
                {VQuestionChonDapAn._renderImage(img, question)}
            </Col>
        )
    }

    _renderQuestionTextAndAudio(question: QuesChonDapAnObj) {
        return (
            <Touchable style={styles.containerText}
                       onPress={() => {this.imvPlayAudio && this.imvPlayAudio.playAudio()}}>
                {VQuestionChonDapAn._renderQuestionText(question, this.props.PathUtils)}
                {question.audio && <ImvPlayAudio ref={(ref) => {this.imvPlayAudio = ref}}
                                                 audio={question.audio}
                                                 PathUtils={this.props.PathUtils}
                                                 style={styles.imvAudio}/>}
            </Touchable>
        )
    }

    private static _renderQuestionText(question: QuesChonDapAnObj, PathUtils: IPathUtilsModule) {
        let questionStr = question.getQuestion();
        if (!questionStr && question.audio)
            questionStr = "What Do You Hear?";

        if (isEmpty(questionStr))
            return null;

        if (question.type === "html") {
            return <WebViewCustom isAutoHeightWebView htmlSource={{html: questionStr}}
                                  dirCacheImage={RNFetchBlob.fs.dirs.DocumentDir + "/download/"}
                                  ROOT_RESOURCE={PathUtils.getROOT_RESOURCE()}/>
        } else {
            // return <HTMLView value={"<b>" + questionStr + "</b>"} style={s.flex_i}/>
            return <HTMLView value={questionStr} style={s.flex_i}/>
        }
    }

    private static _renderImage(img: string, question: QuesChonDapAnObj): any {
        if (isEmpty(img)) return;
        let heightImg;
        if (question.widthImg && question.heightImg) {
            heightImg = (CommonUtils.getScreenW() * question.heightImg) / question.widthImg;
            if (heightImg > 250) heightImg = 200
        } else
            heightImg = 150;

        return <CacheImageClickAble source={{uri: img}} imgH={question.heightImg} imgW={question.widthImg}
                                    style={{height: heightImg, resizeMode: "contain"}}/>
    }

    //endregion

    getQuesObj(): BaseQuestion {
        return this.props.question;
    }
}

export function renderCheckBoxIcon(isAnswered, isCorrectAnswer, sourceImgCorrect: ImageSourcePropType, sourceImgFail: ImageSourcePropType): any {
    if (isAnswered) {
        if (isCorrectAnswer) {
            return <Image style={styles.checkBoxIcon} source={sourceImgCorrect}/>
        } else {
            return <Image style={styles.checkBoxIcon} source={sourceImgFail}/>
        }
    }

}

const styles = StyleSheet.create({
    checkBox: {paddingTop: 8, paddingBottom: 8, marginLeft: 6, marginRight: 6},
    checkBoxIcon: {width: 21, height: 21},
    containerText: {flex: 0, flexDirection: "row", marginVertical: 6},
    explanContainer: {backgroundColor: "#ADE0C1", padding: 12, marginTop: 9, borderRadius: 3},
    imvAudio: {width: 20, height: 20},
    rightTextCb: {marginLeft: 9},
    tvCorrect: {color: "blue"},
    tvInCorrect: {color: "red"},
    tvExplan: {color: "#BD5407", marginTop: 3}
});
