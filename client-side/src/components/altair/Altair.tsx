import { type FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { useEffect, useRef, useState, memo } from "react";
import vegaEmbed from "vega-embed";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { ToolCall } from "../../multimodal-live-types";

const declaration: FunctionDeclaration = {
  name: "render_altair",
  description: "Displays an altair graph in json format.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      json_graph: {
        type: SchemaType.STRING,
        description:
          "JSON STRING representation of the graph to render. Must be a string, not a json object",
      },
    },
    required: ["json_graph"],
  },
};

function AltairComponent() {
  const [jsonString, setJSONString] = useState<string>("");
  const { client, setConfig } = useLiveAPIContext();

  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: "audio",
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
        },
      },
      systemInstruction: {
        parts: [
          {
            text: `
Machine Learning Knowledge:

Start with basic concepts:
- Define supervised, unsupervised, and reinforcement learning.
- Explain the difference between classification and regression.
- Describe the bias-variance tradeoff.

Move to more advanced topics:
- Discuss common machine learning algorithms (e.g., decision trees, support vector machines, neural networks).
- Explain the importance of data preprocessing and feature engineering.
- Describe the concept of overfitting and how to address it (e.g., regularization, cross-validation).

Assess practical understanding:
- Present a hypothetical machine learning problem and ask the user to describe a potential approach to solving it.
- Inquire about their experience with specific machine learning libraries or tools (e.g., scikit-learn, TensorFlow, PyTorch).

Soft Skills:

Evaluate communication and clarity:
- Assess the user's ability to explain complex concepts clearly and concisely.
- Observe their communication style and professionalism.

Assess problem-solving and critical thinking:
- Present a challenging scenario related to a machine learning project and observe how the user approaches it.
- Evaluate their ability to think critically and identify potential solutions.

Assess teamwork and collaboration:
- Pose hypothetical scenarios involving teamwork and collaboration on a machine learning project.
- Observe how the user describes their preferred working style and how they would handle potential conflicts.

Overall:
- Maintain a professional and engaging interview style.
- Provide constructive feedback to the user throughout the interview.
- At the end of the interview, summarize the user's strengths and areas for improvement in both Machine Learning knowledge and soft skills.

Note:
- This is a comprehensive prompt that covers both technical and soft skills. You can adjust it based on the specific requirements and depth of the assessment.
- For a more interactive experience, consider incorporating a coding challenge or a data analysis task within the interview.
- Ensure that Multimodal Live is capable of conducting real-time interviews and providing feedback based on the user's responses.
`,
          },
        ],
      },
      tools: [
        // there is a free-tier quota for search
        { googleSearch: {} },
        // { functionDeclarations: [declaration] },
      ],
    });
  }, [setConfig]);

  useEffect(() => {
    const onToolCall = (toolCall: ToolCall) => {
      console.log(`got toolcall`, toolCall);
      const fc = toolCall.functionCalls.find(
        (fc) => fc.name === declaration.name,
      );
      if (fc) {
        const str = (fc.args as any).json_graph;
        setJSONString(str);
      }
      // send data for the response of your tool call
      // in this case Im just saying it was successful
      if (toolCall.functionCalls.length) {
        setTimeout(
          () =>
            client.sendToolResponse({
              functionResponses: toolCall.functionCalls.map((fc) => ({
                response: { output: { sucess: true } },
                id: fc.id,
              })),
            }),
          200,
        );
      }
    };
    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client]);

  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (embedRef.current && jsonString) {
      vegaEmbed(embedRef.current, JSON.parse(jsonString));
    }
  }, [embedRef, jsonString]);
  return <div className="vega-embed" ref={embedRef} />;
}

export const Altair = memo(AltairComponent);
