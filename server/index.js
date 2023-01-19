import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import {Configuration, OpenAIApi} from "openai";

const PORT = 5000 || 6000;

dotenv.config();

//! Open AI configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

//! Open AI new instance
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors()); // This going to allow us to call the server from Frontend
app.use(express.json()); // This is going to allow us to pass json from Frontend to Backend

//! Just for check the main route
app.get("/", async (req, res) => {
    res.status(200).send({
        message: "Hello from CodeX"
    });
});

//! Post route to Open AI server
app.post("/", async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0, // fewer = better
            max_tokens: 3000, // Length of text
            top_p: 1,
            frequency_penalty: 0.5, // Rate of repeat sentences when you ask it a similar question
            presence_penalty: 0,
        });
        res.status(200).send({
            bot: response.data.choices[0].text
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({error});
    }
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
