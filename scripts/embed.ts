import { Configuration, OpenAIApi } from "openai";
import { encode } from "gpt-3-encoder";
import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";

const TEXT = `About
I am Syed Muzamil. And this is my blog

Introduction
Hello, I'm Syed Muzamil. I'm a FullStack Developer working with
technologies like Reactjs, Nodejs, Express, Mongodb, Flutter, and also
some AWS technologies like S3, EC2, and others. I am currently working
at wealthup as a Full Stack Developer .

Topics Covered
The articles will mainly cover the topics that I already know well, as
well as those that I am learning. Most of the articles will be about
Web Development, but I will also cover some articles about Data
Structures and Algorithms.

Expertise
As a 2nd year undergraduate student, I have experience with ReactJs,
NodeJs, MongoDB, and some other technologies that I learned on my own.
I have also worked as a Web Developer for more than 2 years.`;

const chunks = TEXT.split("\n\n");

loadEnvConfig("");

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

(async () => {
  for (const chunk of chunks) {
    const content = chunk.replace(/\n/g, " ").trim();

    const content_tokens = encode(content).length;

    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: content,
    });

    const [{ embedding }] = embeddingResponse.data.data;

    const { data, error } = await supabase
      .from("website_data")
      .insert({
        content,
        content_tokens,
        embedding,
      })
      .select("*");

    if (error) {
      console.log(error);
    } else {
      console.log("saved:: ", embedding);
    }
  }
})();
