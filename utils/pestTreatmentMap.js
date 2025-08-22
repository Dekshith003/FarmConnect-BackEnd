// utils/pestTreatmentMap.js
// Maps pest names (or label/web entity descriptions) to treatment recommendations

const pestTreatmentMap = {
  Aphid: [
    "Use insecticidal soap or neem oil spray.",
    "Encourage natural predators like ladybugs.",
    "Remove infested plant parts.",
  ],
  Whitefly: [
    "Spray with insecticidal soap.",
    "Use yellow sticky traps.",
    "Introduce natural predators such as lacewings.",
  ],
  Mealybug: [
    "Apply rubbing alcohol with a cotton swab.",
    "Use neem oil or insecticidal soap.",
    "Remove manually if possible.",
  ],
  "Spider Mite": [
    "Spray with water to dislodge mites.",
    "Use miticide or insecticidal soap.",
    "Increase humidity around plants.",
  ],
  Caterpillar: [
    "Handpick caterpillars from plants.",
    "Use Bacillus thuringiensis (Bt) spray.",
    "Encourage birds and beneficial insects.",
  ],
  // Add more mappings as needed
};

const OpenAI = require("openai");

async function getTreatmentRecommendations(labels, webEntities) {
  // Combine all possible pest names/descriptions
  const allDescriptions = [
    ...(labels || []).map((l) => l.description),
    ...(webEntities || []).map((e) => e.description),
  ];

  // Check static map first
  for (const desc of allDescriptions) {
    if (pestTreatmentMap[desc]) {
      return pestTreatmentMap[desc];
    }
  }

  // Fallback to OpenAI if not found in static map
  if (!process.env.OPENAI_API_KEY) {
    return [
      "No specific treatment recommendations found. Consult a local expert.",
    ];
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const pestName = allDescriptions[0] || "unknown pest";
  const prompt = `Suggest 3 organic and practical treatment recommendations for a crop pest called '${pestName}'.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert crop scientist and pest management advisor.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });
    const text = response.choices[0].message.content;
    // Split into array if possible
    return text
      .split(/\n|\d+\.|•|-/)
      .map((s) => s.trim())
      .filter(Boolean);
  } catch (err) {
    console.error(
      "OpenAI API error:",
      err.response?.data || err.message || err
    );
    return [
      "No specific treatment recommendations found. Consult a local expert.",
    ];
  }
}

module.exports = { getTreatmentRecommendations };
