import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import './index.css';


class IDE {
    panels: {
        benchmarks: HTMLDivElement,
        editor: HTMLDivElement,
        output: HTMLDivElement
    }
    cm: CodeMirror.Editor

    constructor() {
        this.panels = {
            benchmarks: document.querySelector('#panel-benchmarks'),
            editor: document.querySelector('#panel-editor'),
            output: document.querySelector('#panel-output')
        };

        this.cm = CodeMirror(this.panels.editor, {
            lineNumbers: true
        });
    }

    async open(uri: string) {
        var doc = new CodeMirror.Doc(await (await fetch(uri)).text());
        this.cm.swapDoc(doc);
    }
}


function main() {
    var ide = new IDE;
    ide.cm.focus();

    ide.open('/');

    // Useful for debugging in dev console
    Object.assign(window, {ide});
}


document.addEventListener('DOMContentLoaded', main);