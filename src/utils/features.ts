import axios from "axios";
import _ from "lodash";
import { generate } from "random-words";

const generateMCQ = (
    meaning: {
        Text: string
    }[],
    idx: number
): string[] => {
    const correctAns: string = meaning[idx].Text;

    const allMeaningExceptForCorrect = meaning.filter(
        (i) => i.Text !== correctAns
    );

    const incorrectOptions: string[] = _.sampleSize(allMeaningExceptForCorrect, 3).map(
        (i) => i.Text
    );

    const mcqOptions = _.shuffle([...incorrectOptions, correctAns]);

    return mcqOptions;
}

const generator = (): string[] => {
    const arr = generate(8);

    let array: string [] = [];

    for(let i = 0;i < arr.length; i++){
        array.push(arr[i]);
    }
    console.log(array)
    return array;
}

export const translateWords = async (params: LangType): Promise<WordType[]> => {
    try {

        const words = generator().map((i) => ({
            Text: i
        }))

        const rapidkey = import.meta.env.VITE_RAPID_API

        const response = await axios.post(`https://microsoft-translator-text.p.rapidapi.com/translate`, words,
            {
                params: {
                    'to[0]': params,
                    'api-version': '3.0',
                    profanityAction: 'NoAction',
                    textType: 'plain'
                },
                headers: {
                    'content-type': 'application/json',
                    'X-RapidAPI-Key': rapidkey,
                    'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
                },
            }
        );

        const receive: FetchedDataType[] = response.data;

        const arr: WordType[] = receive.map((i, idx) => {

            const options: string[] = generateMCQ(words, idx);

            return {
                word: i.translations[0].text,
                meaning: words[idx].Text,
                options
            }
        });

        return arr;

    } catch (error) {
        console.log(error);
        throw new Error("Some error")
    }
}

export const countMatching = (
    arr1: string[], arr2: string[]
): number => {

    if (arr1.length !== arr2.length) throw new Error("Arrays are not equal");

    let matchingCount = 0;

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] === arr2[i]) matchingCount++;
    }

    return matchingCount;
}

export const fetchAudio = async (text: string, language: LangType): Promise<string> => {

    const key = import.meta.env.VITE_TEXT_TO_SPEECH_API
    const rapidkey = import.meta.env.VITE_RAPID_API

    const encodedParams = new URLSearchParams({
        src: text,
        r: "0",
        c: "mp3",
        f: "8khz_8bit_mono",
        b64: "true"
    });

    if (language === "ja") encodedParams.set("hl", "ja-jp");
    else if (language === "es") encodedParams.set("hl", "es-es")
    else if (language === "fr") encodedParams.set("hl", "fr-fr")
    else encodedParams.set("hl", "hi-in");


    const { data }: { data: string } = await axios.post("https://voicerss-text-to-speech.p.rapidapi.com/", encodedParams, {
        params: {
            key
        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': rapidkey,
            'X-RapidAPI-Host': 'voicerss-text-to-speech.p.rapidapi.com'
        },
    });


    return data;
}