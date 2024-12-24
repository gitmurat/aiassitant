import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";

// upload file to assistant's vector store
export async function POST(request) {
	const formData = await request.formData(); // process file as FormData
	const files = formData.getAll("files"); // retrieve the single file from FormData

	// const vectorStoreId = await getOrCreateVectorStore(); // get or create vector store
	let fileIds = JSON.parse(formData.get("fileIds")); // retrieve existing file ids from FormData
	// upload using the file stream
	for (const file of files) {
		const openaiFile = await openai.files.create({
			file: file,
			purpose: "assistants",
		});
		fileIds.push(openaiFile.id);
	}
	// const openaiFile = await openai.files.create({
	// 	file: file,
	// 	purpose: "assistants",
	// });

	// add file to vector store
	// await openai.beta.vectorStores.files.create(vectorStoreId, {
	// 	file_id: openaiFile.id,
	// });
	//   add file to code interpreter
	await openai.beta.assistants.update(assistantId, {
		tool_resources: {
			code_interpreter: {
				file_ids: fileIds,
			},
		}
	})
	return new Response();
}

// list files in assistant's vector store
export async function GET() {
	// const vectorStoreId = await getOrCreateVectorStore(); // get or create vector store
	// const fileList = await openai.beta.vectorStores.files.list(vectorStoreId);
	// console.log(fileList);
	const myAssistant = await openai.beta.assistants.retrieve(
		assistantId
	);
	const fileList = myAssistant.tool_resources.code_interpreter.file_ids;
	const filesArray = await Promise.all(
		fileList.map(async (file_id) => {
			const fileDetails = await openai.files.retrieve(file_id);
			// const vectorFileDetails = await openai.beta.vectorStores.files.retrieve(
			// 	vectorStoreId,
			// 	file_id
			// );
			return {
				file_id: file_id,
				filename: fileDetails.filename,
				// status: vectorFileDetails.status,
			};
		})
	);


	return Response.json(filesArray);
}

// delete file from assistant's vector store
export async function DELETE(request) {
	const body = await request.json();
	const fileId = body.fileId;

	// const vectorStoreId = await getOrCreateVectorStore(); // get or create vector store
	// await openai.beta.vectorStores.files.del(vectorStoreId, fileId); // delete file from vector store
	await openai.files.del(fileId);
	return new Response();
}

/* Helper functions */

const getOrCreateVectorStore = async () => {
	const assistant = await openai.beta.assistants.retrieve(assistantId);

	// if the assistant already has a vector store, return it
	if (assistant.tool_resources?.file_search?.vector_store_ids?.length > 0) {
		return assistant.tool_resources.file_search.vector_store_ids[0];
	}
	// otherwise, create a new vector store and attatch it to the assistant
	const vectorStore = await openai.beta.vectorStores.create({
		name: "sample-assistant-vector-store",
	});
	await openai.beta.assistants.update(assistantId, {
		tool_resources: {
			file_search: {
				vector_store_ids: [vectorStore.id],
			},
		},
	});
	return vectorStore.id;
};
