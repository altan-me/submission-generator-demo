document.getElementById("generate").addEventListener("click", function () {
  const apiKey = document.getElementById("api-key").value;
  const context = document.getElementById("context").value;
  const tone = document.getElementById("tone").value;
  const accuracy = document.getElementById("accuracy").value;
  const lengthDescriptor = document.getElementById("length").value;

  const maxTokens =
    lengthDescriptor === "Short"
      ? 100
      : lengthDescriptor === "Medium"
      ? 200
      : 500;

  const messages = [
    {
      role: "system",
      content: context, // System-level context for the conversation
    },
    {
      role: "user",
      content: `Generate a ${tone.toLowerCase()} message, ensuring ${accuracy.toLowerCase()} accuracy. Length: ${lengthDescriptor.toLowerCase()}.`,
    },
  ];

  const spinner = document.getElementById("spinner");
  spinner.classList.remove("hidden"); // Show spinner

  if (apiKey) {
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: maxTokens,
        temperature: 0.5,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          response
            .text()
            .then((text) => console.error("Error response body:", text));
          throw new Error("Network response was not ok.");
        }
      })
      .then((data) => {
        if (
          data &&
          data.choices &&
          data.choices.length > 0 &&
          "message" in data.choices[0]
        ) {
          document.getElementById("output").textContent =
            data.choices[0].message.content.trim();
        } else {
          throw new Error("Unexpected response format.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById("output").textContent =
          "Failed to generate text. " + error.message;
      })
      .finally(() => {
        spinner.classList.add("hidden"); // Hide spinner
      });
  } else {
    document.getElementById("output").textContent =
      "Please enter a valid API key.";
    spinner.classList.add("hidden"); // Hide spinner
  }
});
