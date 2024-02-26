const router = require("express").Router();
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { ChatOpenAI, OpenAIEmbeddings } = require("@langchain/openai");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const {
  createStuffDocumentsChain,
} = require("langchain/chains/combine_documents");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { DirectoryLoader } = require("langchain/document_loaders/fs/directory");

const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const prompt =
  ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:
  
  <context>
  {context}
  </context>
  
  Question: {input}
  
  If you dont know just reply I don't understand your question.`);

const splitter = new RecursiveCharacterTextSplitter();

async function loadDirectory(dirPath) {
  const directoryLoader = new DirectoryLoader(dirPath, {
    ".pdf": (path) => new PDFLoader(path, { parsedItemSeparator: "" }),
  });
  const docs = await directoryLoader.load();
  const splitDocs = await splitter.splitDocuments(docs);
  return splitDocs;
}

router.post("/", async (req, res) => {
  const reqBody = await req.body;
  const reqPrompt = reqBody.prompt;
  const docs = await loadDirectory("./pdfs/");
  const vectorStore = await Chroma.fromDocuments(
    docs,
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    }),
    {
      collectionName: "a-test-collection",
      url: "http://localhost:8000",
      collectionMetadata: {
        "hnsw:space": "cosine",
      },
    }
  );
  const documentChain = await createStuffDocumentsChain({
    llm: chatModel,
    prompt,
  });
  const retriever = vectorStore.asRetriever();
  const retrievalChain = await createRetrievalChain({
    combineDocsChain: documentChain,
    retriever,
  });
  const result = await retrievalChain.invoke({
    input: reqPrompt,
  });
  res.send({ message: result.answer.toString() });
});

module.exports = router;
