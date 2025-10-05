import gradio as gr
from transformers import (
    AutoModelForCausalLM, AutoTokenizer,
    BlipProcessor, BlipForConditionalGeneration,
    WhisperProcessor, WhisperForConditionalGeneration,
)
import torch
from PIL import Image
import pandas as pd
import fitz  # PyMuPDF
import os
import json
import faiss
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

# --- Load larger Mixtral or compatible model ---
# Note: Use a valid model checkpoint that exists on HuggingFace
model_name = "mistralai/Mixtral-8x7B-Instruct-v0.1"  # Fixed model name
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map="auto"
)
model.eval()

# --- Load BLIP2 for better image captioning ---
blip_processor = BlipProcessor.from_pretrained("Salesforce/blip2-opt-2.7b")
blip_model = BlipForConditionalGeneration.from_pretrained(
    "Salesforce/blip2-opt-2.7b",
    torch_dtype=torch.float16,
    device_map="auto"
)
blip_model.eval()

# --- Load Whisper large for voice input ---
whisper_processor = WhisperProcessor.from_pretrained("openai/whisper-large-v2")
whisper_model = WhisperForConditionalGeneration.from_pretrained(
    "openai/whisper-large-v2",
    torch_dtype=torch.float16,
    device_map="auto"
)
whisper_model.eval()


# --- Document storage and retrieval setup ---
class DocumentStore:
    def __init__(self):
        self.documents = []
        self.embeddings = []
        self.index = None
        self.vectorizer = None

    def embed_texts(self, texts):
        # Simple TF-IDF embeddings (replace with proper sentence embeddings for better results)
        vectorizer = TfidfVectorizer(stop_words='english', max_features=512)
        return vectorizer.fit_transform(texts).toarray(), vectorizer

    def add_documents(self, docs):
        self.documents.extend(docs)
        emb, self.vectorizer = self.embed_texts(self.documents)
        emb = np.array(emb).astype('float32')
        dim = emb.shape[1]

        self.index = faiss.IndexFlatL2(dim)
        self.index.add(emb)
        self.embeddings = emb

    def query(self, query_text, top_k=3):
        if not self.vectorizer or not self.index:
            return []
        q_emb = self.vectorizer.transform([query_text]).toarray().astype('float32')
        D, I = self.index.search(q_emb, min(top_k, len(self.documents)))
        return [self.documents[i] for i in I[0] if i < len(self.documents)]


doc_store = DocumentStore()


# --- Utility: read files ---
def read_file(file):
    if file is None:
        return ""
    ext = os.path.splitext(file.name)[1].lower()
    try:
        if ext == ".txt":
            with open(file.name, 'r', encoding='utf-8') as f:
                return f.read()
        elif ext == ".pdf":
            doc = fitz.open(file.name)
            return "\n".join(page.get_text() for page in doc)
        elif ext == ".csv":
            df = pd.read_csv(file.name)
            return df.head(20).to_string()
        else:
            return ""
    except Exception as e:
        return f"Error reading file: {str(e)}"


# --- Improved image captioning ---
def describe_image(image):
    try:
        image = image.convert("RGB")
        inputs = blip_processor(images=image, return_tensors="pt")
        inputs = {k: v.to(model.device) for k, v in inputs.items()}
        with torch.no_grad():
            outputs = blip_model.generate(**inputs, max_length=50)
        caption = blip_processor.decode(outputs[0], skip_special_tokens=True)
        return caption
    except Exception as e:
        return f"Error describing image: {str(e)}"


# --- Voice transcription ---
def transcribe_audio(audio):
    if audio is None:
        return ""
    try:
        sample_rate, audio_array = audio
        audio_input = whisper_processor(
            audio_array,
            sampling_rate=sample_rate,
            return_tensors="pt"
        )
        audio_input = {k: v.to(model.device) for k, v in audio_input.items()}
        with torch.no_grad():
            predicted_ids = whisper_model.generate(**audio_input)
        transcription = whisper_processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
        return transcription
    except Exception as e:
        return f"Error transcribing audio: {str(e)}"


# --- Generate response with retrieval augmented context ---
def generate_response(prompt, history):
    try:
        # Retrieve top-k similar documents from doc_store
        retrieved_docs = doc_store.query(prompt, top_k=3) if doc_store.index else []
        context = "\n\n".join(retrieved_docs)

        # Combine context, history, and prompt
        history_text = "\n".join([f"User: {h['user']}\nAI: {h['ai']}" for h in history[-5:]])  # last 5 exchanges
        full_prompt = f"{context}\n{history_text}\nUser: {prompt}\nAI:"

        # Encode and generate
        input_ids = tokenizer(
            full_prompt,
            return_tensors="pt",
            truncation=True,
            max_length=4096
        ).input_ids.to(model.device)

        with torch.no_grad():
            output_ids = model.generate(
                input_ids,
                max_new_tokens=256,
                temperature=0.7,
                top_p=0.9,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id,
                eos_token_id=tokenizer.eos_token_id,
            )
        response = tokenizer.decode(output_ids[0][input_ids.shape[1]:], skip_special_tokens=True)
        return response.strip()
    except Exception as e:
        return f"Error generating response: {str(e)}"


# --- Chat function ---
def chat_fn(user_input, history, uploaded_file=None, uploaded_image=None, voice_input=None):
    # Add new docs from file
    if uploaded_file:
        content = read_file(uploaded_file)
        if content.strip() and not content.startswith("Error"):
            doc_store.add_documents([content])

    # Describe image
    image_caption = ""
    if uploaded_image:
        image_caption = describe_image(uploaded_image)

    # Transcribe voice input
    voice_text = ""
    if voice_input:
        voice_text = transcribe_audio(voice_input)

    # Compose full user prompt with all modalities
    full_input = user_input if user_input else ""
    if voice_text and not voice_text.startswith("Error"):
        full_input = voice_text + "\n" + full_input
    if image_caption and not image_caption.startswith("Error"):
        full_input = image_caption + "\n" + full_input

    if not full_input.strip():
        full_input = "Hello"

    response = generate_response(full_input, history)
    history.append({"user": full_input, "ai": response})

    # Format chat display
    chat_display = "\n\n".join([f"**You:** {item['user']}\n\n**AI:** {item['ai']}" for item in history[-20:]])

    return chat_display, history


# --- Save/load chat ---
def save_chat(history):
    try:
        with open("chat_history.json", "w", encoding="utf-8") as f:
            json.dump(history, f, ensure_ascii=False, indent=2)
        return "✅ Chat saved."
    except Exception as e:
        return f"Error saving chat: {str(e)}"


def load_chat():
    try:
        if os.path.exists("chat_history.json"):
            with open("chat_history.json", "r", encoding="utf-8") as f:
                history = json.load(f)
            chat_display = "\n\n".join([f"**You:** {item['user']}\n\n**AI:** {item['ai']}" for item in history[-20:]])
            return chat_display, history
        return "No chat history found.", []
    except Exception as e:
        return f"Error loading chat: {str(e)}", []


# --- Gradio Interface ---
with gr.Blocks() as demo:
    gr.Markdown("# 🧠 Advanced Local AI Chatbot (Mixtral 8x7B + BLIP2 + Whisper + RAG)")

    chatbot_output = gr.Markdown()
    user_input = gr.Textbox(label="Your message", placeholder="Ask me anything...", lines=2)
    uploaded_file = gr.File(label="Upload a file (.pdf, .txt, .csv)")
    uploaded_image = gr.Image(label="Upload an image", type="pil")
    voice_input = gr.Audio(label="Speak to the AI", sources=["microphone"], type="numpy")

    with gr.Row():
        submit_btn = gr.Button("💬 Send")
        save_btn = gr.Button("💾 Save Chat")
        load_btn = gr.Button("📂 Load Chat")

    state = gr.State([])

    submit_btn.click(
        chat_fn,
        [user_input, state, uploaded_file, uploaded_image, voice_input],
        [chatbot_output, state]
    )
    save_btn.click(save_chat, [state], chatbot_output)
    load_btn.click(load_chat, [], [chatbot_output, state])

if __name__ == "__main__":
    demo.launch()