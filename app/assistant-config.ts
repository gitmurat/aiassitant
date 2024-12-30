export let assistantId = "asst_An4ib0JxarQ3NaVYoLvmNK3n"; // set your assistant ID here

if (assistantId === "") {
	assistantId = process.env.OPENAI_ASSISTANT_ID;
}

export let baseUrl = "http://localhost:5000"; 