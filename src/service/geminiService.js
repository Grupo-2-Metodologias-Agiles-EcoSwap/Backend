import { z } from "zod";
import { gemini, GEMINI_MODEL, GEMINI_EMBED_MODEL } from "../config/gemini.js";

export async function generateJson({ prompt, schema, image }) {
    const input = [{ type: "text", text: prompt }];
    if (image) input.push({ type: "image", data: image.base64, mime_type: image.mimeType });

    const interaction = await gemini.interactions.create({
        model: GEMINI_MODEL,
        input,
        response_format: {
            type: "text",
            mime_type: "application/json",
            schema: z.toJSONSchema(schema),
        },
    });
    return schema.parse(JSON.parse(interaction.output_text));
}

export async function embed(text) {
    const res = await gemini.models.embedContent({
        model: GEMINI_EMBED_MODEL,
        contents: text,
        config: { outputDimensionality: 768 },
    });
    return res.embeddings[0].values;
}