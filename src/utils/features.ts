import axios from "axios";
import { generate } from "random-words";

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

        const receive : FetchedDataType[] = response.data;

        const arr: WordType[] = receive.map((i, idx) => {


            return {
                word: i.translations[0].text,
                meaning: words[idx].Text,
                options: ["asd"]
            }
        });

        return arr;

    } catch (error) {
        console.log(error);
        throw new Error("Some error")
    }
}