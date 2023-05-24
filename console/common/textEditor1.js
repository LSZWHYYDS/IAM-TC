/**
 * Created by tianyun on 2016/12/29.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import {CompositeDecorator, Editor, EditorState} from "draft-js";

const HANDLE_REGEX = /\@[\w]+/g;
const HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g;

function handleStrategy(contentBlock, callback) {
    findWithRegex(HANDLE_REGEX, contentBlock, callback);
}

function hashtagStrategy(contentBlock, callback) {
    findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}

function findWithRegex(regex, contentBlock, callback) {
    const text = contentBlock.getText();
    let matchArr, start;
    while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        callback(start, start + matchArr[0].length);
    }
}

const HandleSpan = (props) => {
    return <span {...props} style={styles.handle}>{props.children}</span>;
};

const HashtagSpan = (props) => {
    return <span {...props} style={styles.hashtag}>{props.children}</span>;
};

const styles = {
    root: {
        fontFamily: '\'Helvetica\', sans-serif',
        padding: 20,
        width: 600
    },
    editor: {
        border: '1px solid #ddd',
        cursor: 'text',
        fontSize: 16,
        minHeight: 40,
        padding: 10
    },
    button: {
        marginTop: 10,
        textAlign: 'center',
    },
    handle: {
        color: 'rgba(98, 177, 254, 1.0)',
        direction: 'ltr',
        unicodeBidi: 'bidi-override'
    },
    hashtag: {
        color: 'rgba(95, 184, 138, 1.0)'
    }
};

class TextEditor extends Component {
    constructor(...args) {
        super(...args);
        const compositeDecorator = new CompositeDecorator([
            {
                strategy: handleStrategy,
                component: HandleSpan
            },
            {
                strategy: hashtagStrategy,
                component: HashtagSpan
            }
        ]);
        this.state = {editorState: EditorState.createEmpty(compositeDecorator)};
        this.onChange = (editorState) => this.setState({editorState});
    }
    render() {
        return <Editor editorState={this.state.editorState} onChange={this.onChange} />;
    }
}

export default TextEditor;