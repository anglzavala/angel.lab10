document.addEventListener("DOMContentLoaded", () => {
  const comparisonTable = document.getElementById("comparisonTableBody");
  const filterButtons = document.querySelectorAll(".filter-btn");

  if (filterButtons.length && comparisonTable) {
    const rows = Array.from(comparisonTable.querySelectorAll("tr"));

    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const category = button.dataset.filter;

        rows.forEach(row => {
          const show = category === "all" || row.dataset.category === category;
          row.style.display = show ? "" : "none";
        });
      });
    });
  }

  const advisorForm = document.getElementById("advisorForm");
  if (advisorForm) {
    advisorForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const profile = {
        budget: document.getElementById("budget").value,
        goal: document.getElementById("goal").value,
        hardware: document.getElementById("hardware").value,
        experience: document.getElementById("experience").value,
        ecosystem: document.getElementById("ecosystem").value
      };

      const result = getRecommendation(profile);
      const resultBox = document.getElementById("recommendationResult");

      const scoreList = Object.entries(result.scores)
        .map(([os, score]) => `<span class="score-pill">${os}: ${score}</span>`)
        .join("");

      resultBox.innerHTML = `
        <h3>${result.recommendationText}</h3>
        <p><strong>Recommended:</strong> ${result.winner}</p>
        <p>${result.reasons[0]}</p>
        <p>${result.reasons[1]}</p>
        <p>${result.reasons[2]}</p>
        <p><strong>Alternatives:</strong> ${result.runnerUp} and ${result.third}</p>
        <div class="score-list">${scoreList}</div>
      `;
    });
  }

  const chatBox = document.getElementById("chatBox");
  const chatInput = document.getElementById("chatInput");
  const sendChat = document.getElementById("sendChat");

  function addMessage(text, type = "bot") {
    if (!chatBox) return;

    const el = document.createElement("div");
    el.className = `message ${type}`;
    el.textContent = text;
    chatBox.appendChild(el);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function respondToQuestion(question) {
    const q = question.toLowerCase();

    if (q.includes("computer science") || q.includes("student")) {
      addMessage("For computer science students, Linux is often the strongest choice because it supports programming tools, servers, and command-line workflows. Windows is also a good option for general use and software compatibility, while macOS is excellent for Apple users and creative work.", "bot");
      return;
    }

    if (q.includes("ai model") || q.includes("ai") || q.includes("machine learning")) {
      addMessage("For AI model development, Linux is usually best because of the strong ecosystem around Python, CUDA, deep learning frameworks, and server tools. macOS is a strong second choice for Apple devices and creative workflows, while Windows works well for accessibility and mainstream software.", "bot");
      return;
    }

    if (q.includes("gaming")) {
      addMessage("For gaming, Windows is typically the best choice because it offers the widest game library, strongest driver support, and the most mainstream GPU compatibility. Linux is a great option for enthusiasts, but Windows remains the top gaming platform for most users.", "bot");
      return;
    }

    if (q.includes("budget") || q.includes("limited budget")) {
      addMessage("If your budget is limited, Linux is usually the most cost-effective option because many distributions are free and efficient. Windows is a good value when you need broad compatibility, while macOS usually requires more expensive hardware.", "bot");
      return;
    }

    if (q.includes("web server") || q.includes("server")) {
      addMessage("For managing a web server, Linux is generally the best fit because of its performance, open-source ecosystem, and server-first tools. Windows can work for certain enterprise environments, but Linux is the most common choice for hosting and backend infrastructure.", "bot");
      return;
    }

    if (q.includes("windows")) {
      addMessage("Windows is ideal if you want broad app compatibility, gaming support, and an easy learning curve. It works especially well for students, office productivity, and commercial software. The trade-off is that it can be heavier on system resources and requires more attention to security updates.", "bot");
      return;
    }

    if (q.includes("macos") || q.includes("mac os")) {
      addMessage("macOS is a great fit for creative users, Apple device owners, and people who value a polished workflow. It offers strong performance and integration, but the main trade-off is cost and hardware restrictions because it only runs on Apple devices.", "bot");
      return;
    }

    if (q.includes("linux")) {
      addMessage("Linux is the most flexible and powerful option for customization, programming, server use, and cost efficiency. It is a strong choice for advanced users and developers, but it can feel more technical for beginners because of the command line and configuration options.", "bot");
      return;
    }

    addMessage("A good general rule is: choose Windows for compatibility, macOS for polished user experience and creative work, and Linux for customization, programming, and servers. If you tell me your budget, goals, and hardware, I can recommend a better fit.", "bot");
  }

  if (sendChat && chatInput) {
    sendChat.addEventListener("click", () => {
      const question = chatInput.value.trim();
      if (!question) return;

      addMessage(question, "user");
      chatInput.value = "";
      setTimeout(() => respondToQuestion(question), 200);
    });

    chatInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const question = chatInput.value.trim();
        if (!question) return;

        addMessage(question, "user");
        chatInput.value = "";
        setTimeout(() => respondToQuestion(question), 200);
      }
    });
  }

  document.querySelectorAll(".quick-btn").forEach(button => {
    button.addEventListener("click", () => {
      const question = button.dataset.question;
      addMessage(question, "user");
      setTimeout(() => respondToQuestion(question), 200);
    });
  });
});

function getRecommendation(profile) {
  const scores = {
    Windows: 0,
    macOS: 0,
    Linux: 0
  };

  const budgetMap = {
    low: { Windows: 6, macOS: 2, Linux: 10 },
    mid: { Windows: 8, macOS: 6, Linux: 9 },
    high: { Windows: 8, macOS: 8, Linux: 8 },
    premium: { Windows: 7, macOS: 9, Linux: 7 }
  };

  const goalMap = {
    general: { Windows: 8, macOS: 7, Linux: 6 },
    gaming: { Windows: 12, macOS: 5, Linux: 7 },
    ai: { Windows: 6, macOS: 8, Linux: 12 },
    software: { Windows: 9, macOS: 8, Linux: 10 },
    server: { Windows: 5, macOS: 6, Linux: 14 },
    design: { Windows: 7, macOS: 11, Linux: 5 }
  };

  const hardwareMap = {
    new: { Windows: 5, macOS: 6, Linux: 7 },
    older: { Windows: 5, macOS: 1, Linux: 10 },
    apple: { Windows: 2, macOS: 12, Linux: 4 }
  };

  const experienceMap = {
    beginner: { Windows: 8, macOS: 6, Linux: 3 },
    intermediate: { Windows: 7, macOS: 7, Linux: 8 },
    advanced: { Windows: 5, macOS: 7, Linux: 10 }
  };

  const ecosystemMap = {
    broad: { Windows: 10, macOS: 6, Linux: 5 },
    apple: { Windows: 2, macOS: 12, Linux: 4 },
    developer: { Windows: 6, macOS: 8, Linux: 12 },
    custom: { Windows: 4, macOS: 7, Linux: 12 }
  };

  Object.entries(budgetMap[profile.budget]).forEach(([os, value]) => scores[os] += value);
  Object.entries(goalMap[profile.goal]).forEach(([os, value]) => scores[os] += value);
  Object.entries(hardwareMap[profile.hardware]).forEach(([os, value]) => scores[os] += value);
  Object.entries(experienceMap[profile.experience]).forEach(([os, value]) => scores[os] += value);
  Object.entries(ecosystemMap[profile.ecosystem]).forEach(([os, value]) => scores[os] += value);

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const winner = sorted[0][0];
  const runnerUp = sorted[1][0];
  const third = sorted[2][0];

  let recommendationText = "";
  let reasons = [];

  if (winner === "Windows") {
    recommendationText = "Windows is the best choice for your profile.";
    reasons = [
      "Strong software compatibility for productivity, gaming, and business tasks.",
      "Easy to use for beginners and students.",
      "Broad hardware availability and large app ecosystem."
    ];
  } else if (winner === "macOS") {
    recommendationText = "macOS is the best choice for your profile.";
    reasons = [
      "Excellent battery life and performance on Apple hardware.",
      "Strong creative and productivity workflows.",
      "Seamless ecosystem for design, content creation, and Apple device users."
    ];
  } else {
    recommendationText = "Linux is the best choice for your profile.";
    reasons = [
      "Excellent for programming, servers, automation, and customization.",
      "Very cost-efficient and secure.",
      "Powerful for advanced users who want full control and flexibility."
    ];
  }

  return {
    winner,
    runnerUp,
    third,
    recommendationText,
    reasons,
    scores
  };
}
