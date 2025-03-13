let latestAIResponse = null;
const BASE_API_URL=`https://generativelanguage.googleapis.com/v1beta/models/`
const API_KEY=`AIzaSyCUFIqU7V9jQMmr69kXuVkQh38W4Xzsuho`
// Function to process comment with AI
async function processCommentWithAI(comment) {
  try {
    const response = await fetch(`${BASE_API_URL}gemini-2.0-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `Analyze this YouTube comment: "${comment}"

Check ONLY for the following three specific issues:
1. Hate speech (targeting individuals or groups based on protected characteristics)
2. Vulgar language (profanity, explicit sexual content, excessive swearing)
3. Misinformation (demonstrably false claims about important topics)

If NONE of these specific issues are found, respond with "PASS" only.

If any of these issues ARE found, respond in this exact format:
"ISSUE_FOUND: [brief description of specific issue]
SUGGESTION: [polite alternative version of the comment]"

Be extremely precise - only flag comments containing clear examples of hate speech, vulgar language, or demonstrably false information.` }
            ]
          }
        ]
      }),
    });
    
    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    // Only store and return meaningful responses (not "PASS")
    if (aiText && aiText.trim() !== "PASS") {
      latestAIResponse = aiText;
      return aiText;
    } else {
      latestAIResponse = null;
      return null;
    }
  } catch (error) {
    console.error("AI processing error:", error);
    return "Error processing with AI";
  }
}

const imagePrompt=``

async function processImageWithAI(image){
  const reqBody={
    content:[
      {
        parts:[
          {text: imagePrompt},
          {inlineData:{mimetype:"image/png",data:base64Image}}
        ]
      }
    ]
  }
  try{
    const response=await fetch(`${BASE_API_URL}gemini-pro-vision:generateContent?key=${API_KEY}`,{
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(reqBody)
    })
    const result =await response.json();
    return result;
  }catch(error){
    console.error("AI processing error:", error);
    return "Error processing with AI";
  }
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "logElements") {
    // Process the comment with AI
    processCommentWithAI(request.comment)
      .then(aiResponse => {
        sendResponse({ success: true, aiResponse });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.toString() });
      });
    return true; 
  }
  if (request.action === "processComment") {
    processCommentWithAI(request.comment).then(aiResponse => {
      sendResponse({ success: true, aiResponse: aiResponse });
    });
    return true;  
  }
  // Handle requests for the latest AI response
  if (request.action === "getLatestAIResponse") {
    sendResponse({ success: true, aiResponse: latestAIResponse });
    return true;
  }
});