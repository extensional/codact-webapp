import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface QuestionInput {
    code: string;
    selection: string;
    selectionStart: number;
    selectionEnd: number;
    q: string;
}

export async function answer({ code, selection, q }: QuestionInput) {
    const prompt =
        (code.length > 0
            ? "given the following javascript code:\n> " + code.replace("\n", "\n> ")
            : "") +
        (selection.length > 0
            ? "\nconsider the following snippet:\n> " +
            selection.replace("\n", "\n> ")
            : "") +
        '\nplease answer "' +
        q +
        '":\n';

    const completion = await openai.createCompletion({
        model: "text-davinci-002",
        temperature: 1,
        max_tokens: 500,
        n: 1,
        prompt,
    });
    const compl =
        completion.data.choices === undefined
            ? ""
            : completion.data.choices[0].text;
    return compl === undefined ? "" : compl;
}

export async function promptYesNo(question: string) {
    var prompty =
        "Are these statements questions looking for knowledge (yes/no)?" +
        '\n* "What is life?": yes' +
        '\n* "Does this function have a variable?": yes' +
        '\n* "can you change this function to add a cat?": no' +
        '\n* "where are the bugs in this function": yes' +
        '\n* "can we even?": yes' +
        '\n* "could you add a method that absorbs ints?": no' +
        '\n* "fuck I am here": yes' +
        '\n* "would you like to do eating": yes' +
        '\n* "please sort two variables": no' +
        '\n* "write me a goo.": no' +
        '\n* "why does this code have multiple lines": yes' +
        '\n* "explain what this line does.": yes' +
        '\n* "Show me any bugs": yes' +
        '\n* "add a new line.": no' +
        '\n* "can we open a thing": yes' +
        '\n* "oh yeah hi.": yes' +
        '\n* "would you implement a variable?": no' +
        '\n* "tell me whats happening": yes' +
        `\n* "${question}":`;

    const completion = await openai.createCompletion({
        model: "text-davinci-002",
        temperature: 0.7,
        max_tokens: 6,
        n: 1,
        prompt: prompty,
    });
    const compl =
        completion.data.choices === undefined
            ? ""
            : completion.data.choices[0].text;
    const answer = compl === undefined ? "" : compl.toLowerCase();
    return ["yes", "cor", "abs", "def", "sure"].some(
        (a) => answer.includes(a) || a.includes(answer)
    );
};

export async function completionEdit({ code, selection, selectionStart, selectionEnd, q }: QuestionInput) {
    const prompt =
        (code.length > 0
            ? "Given the following javascript code:\n> " + code.replace("\n", "\n> ") + "\n"
            : "") +
        (selection.length > 0
            ? `Consider the following snippet from ${selectionStart}-${selectionEnd}:\n> ` +
            selection.replace("\n", "\n> ") + "\n"
            : "") +
        `please write code in response to "${q}":`;

    const completions = await openai.createCompletion({
        model: "text-davinci-002",
        temperature: 1,
        max_tokens: 500,
        n: 1,
        prompt,
    });

    return completions.data.choices
        ?.map((sugg) => sugg.text)
        .filter((sugg) => sugg != undefined)
        .map((sugg) => {
            sugg = sugg === undefined ? "" : sugg;
            if (sugg.length > 0)
                sugg = sugg.slice(sugg[0] == "\n" ? 1 : sugg[1] == "\n" ? 2 : 0, sugg.length);
            //console.log("sugg1: ", sugg);
            sugg = sugg.replace("\n> ","\n").replace("\n>","\n");
            //console.log("sugg2: ", sugg);
            if (sugg.length > 0 && sugg[0] == ">") {
                sugg = sugg.slice(1);
                if (sugg.length > 0 && sugg[0] == " ")
                    sugg = sugg.slice(1);
            }
            //console.log("sugg3: ", sugg);
            return sugg;
        });
};