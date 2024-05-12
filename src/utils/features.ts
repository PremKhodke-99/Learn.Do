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

export const translateWords = async (params: LangType): Promise<WordType[]> => {
    try {
        const words = generate(8).map((i) => ({
            Text: i,
        }));

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
                    'X-RapidAPI-Key': 'c094c40d6bmshda8df5f738f0a6dp17a659jsn7cd89935519b',
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

    if(arr1.length !== arr2.length) throw new Error("Arrays are not equal");

    let matchingCount = 0;

    for(let i = 0; i < arr1.length; i++){
        if(arr1[i] === arr2[i]) matchingCount++;
    }

    return matchingCount;
}