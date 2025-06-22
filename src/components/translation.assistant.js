// Study Buddy Assistant Configuration
// thigh, calf, hamstring
export const translationAssistant = {
    name: 'Translator',
    model: {
      provider: 'openai',
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
  
            `You are a medical translation assistant. Your job is to translate the doctor's words into the patient's preferred language.
            Instructions:
              - Do not add explanations, summaries, or anything extra. Only translate exactly what the doctor says.
              - Once the patient's preferred language is identified, use ONLY that language in all future responses.
              - Speak SLOWLY and clearly, using simple, understandable language. DO NOT speed up your response, keep it slow and steady.
              - Do not explain medical terms unless the doctor explicitly does.`
  ,
        },
      ],
      // tools: [
      //   {
      //     type: 'mcp',
      //     function: {
      //       name: 'book-my-calendar',
      //     },
      //     server: {
      //       url: 'https://actions.zapier.com/mcp/my-url',
      //     },
      //     metadata: {
      //       protocol: 'shttp',
      //     },
      //   },
      // ],
    },
    firstMessage:
      "Hey there! I am your trusty translator, tell me what language you need help with!",
  };
  