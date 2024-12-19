let prompt = document.querySelector ("#prompt");
let btn = document.querySelector("#btn");
let chatContainer = document.querySelector(".chat-container");
let userMessage = null;
let Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_API_KEY";

// Function to create chat boxes
function createChatbox(html, className) {
    let div = document.createElement("div");
    div.classList.add(className);
    div.innerHTML = html;
    return div;
}

// Fetch API Response
async function getApiResponse(aiChatBox) {
    let textElement = aiChatBox.querySelector(".text");
    try {
        // Make API request
        let response = await fetch(Api_Url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "prompt": {
                    "text": userMessage
                }
            }),
        });

        // Parse the response
        let data = await response.json();
        console.log("API Response:", data); // Log the raw response for debugging

        // Check for errors in the response
        if (data?.error) {
            console.error("API Error:", data.error);
            textElement.innerText = `Error: ${data.error.message}`;
            return;
        }

        // Extract AI response
        let apiResponse = data?.candidates?.[0]?.output || "AI didn't provide a response.";
        textElement.innerText = apiResponse;

    } catch (error) {
        // Handle fetch/network errors
        console.error("Error fetching API response:", error);
        textElement.innerText = "Error fetching response. Please try again.";
    } finally {
        // Hide loading spinner
        aiChatBox.querySelector(".loading").style.display = "none";
    }
}
// Display loading animation
function showLoading() {
    let html = `
        <div class="img">
            <img src="image/chhat-ai.png" alt="" width="30px">
        </div>
        <p class="text"></p>
        <img src="image/loading.gif" height="60" alt="" class="loading">
    `;
    let aiChatBox = createChatbox(html, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    getApiResponse(aiChatBox);
}
// Event Listener for User Input
btn.addEventListener("click", () => {
    userMessage = prompt.value.trim();
    if (!userMessage) return;
    let html = `
        <div class="img">
            <img src="image/user.png" alt="" width="30px">
        </div>
        <p class="text"></p>
    `;
    let userChatBox = createChatbox(html, "user-chat-box");
    userChatBox.querySelector(".text").innerText = userMessage;
    chatContainer.appendChild(userChatBox);
    prompt.value = "";
    setTimeout(showLoading, 500);
});
